import React, { useEffect, useState, useCallback, type JSX } from "react"
import { Button, Table, Modal, Form, Row, Col, InputGroup, Pagination } from "react-bootstrap"
import { fetchUsers, deleteUser } from "../../infrastructure/api/api"
import { useNavigate } from "react-router-dom"
import type { User } from "../../infrastructure/model/userModel"
import { FaSearch, } from "react-icons/fa"
import { Eye, Pencil, Trash2 } from "lucide-react"

const ROLE_OPTIONS = ["Admin", "Editor", "Viewer"]
const PAGE_SIZE = 10 // configurable

export default function UsersData(): JSX.Element {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("") // "true" or "false"
    const [sortField, setSortField] = useState<"name" | "email" | "">("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const [page, setPage] = useState(1) // current page
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const navigate = useNavigate()

    // debounce search (300ms)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
        return () => clearTimeout(t)
    }, [search])

    // reset to first page when filters/search/sort change
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, role, status, sortField, sortOrder])

    const loadUsers = useCallback(async () => {
        setLoading(true)
        try {
            const params: any = {
                _page: page,
                _limit: PAGE_SIZE,
            }
            if (sortField) { params._sort = sortField; params._order = sortOrder }
            if (debouncedSearch) params.q = debouncedSearch
            if (role) params.role = role
            if (status) params.isActive = status

            const resp = await fetchUsers(params) // axios GET expected

            // 1) Try header
            const headerTotal = resp.headers?.['x-total-count'] || resp.headers?.['X-Total-Count']

            // 2) Handle body shapes:
            // - case A: json-server / earlier code: resp.data is array
            // - case B: backend sends { data, total }
            if (resp.data && typeof resp.data === 'object' && Array.isArray(resp.data)) {
                // body has { data, total }
                setUsers(resp.data)
                setTotal(typeof resp.data === 'number' ? resp.data :
                    headerTotal ? Number(headerTotal) : resp.data.length)
            } else {
                // resp.data is an array
                setUsers(resp.data || [])
                setTotal(headerTotal ? Number(headerTotal) : (resp.data ? resp.data : 0))
            }

            // DEBUG logs (remove when working)
            console.info('loadUsers -> page, params, got', { page, params, countHeader: headerTotal, bodyLength: Array.isArray(resp.data) ? resp.data.length : resp.data, total })
        } catch (err) {
            console.error('Failed to load users', err)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch, sortField, sortOrder, role, status])


    // load when page or filters change
    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const handleDelete = async () => {
        if (!selectedId) return
        try {
            await deleteUser(selectedId)
            setShowConfirm(false)
            // If deleting last item on page reduce page if needed
            // reload
            if (users.length === 1 && page > 1) {
                setPage((p) => p - 1)
            } else {
                loadUsers()
            }
        } catch (err) {
            console.error("Delete failed", err)
        }
    }

    const toggleSort = (field: "name" | "email") => {
        if (sortField === field) {
            // toggle order
            setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const onRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value)
        setPage(1)
    }

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
        setPage(1)
    }

    return (
        <div className="container-fluid mt-4">
            <Row className="align-items-center mb-3 gx-2">

                <Col xs={12} md={12}>
                    <Row className="gx-2">
                        <Col xs={6} sm={6} className="mb-2">
                            <InputGroup>
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search name or email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Col>

                        {/* Role filter */}
                        <Col xs={6} sm={3} className="mb-2">

                            <Form.Select name="role" value={role} onChange={onRoleChange}>
                                <option value="">All Roles</option>
                                {ROLE_OPTIONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col xs={6} sm={3} className="mb-2">
                            <Form.Select name="status" value={status} onChange={onStatusChange}>
                                <option value="">All Statuses</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Col>

                    </Row>
                </Col>


            </Row>

            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="me-0">Users</h3>
                    <Button onClick={() => navigate("/users/create")}>+ Create User</Button>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={() => toggleSort("name")}>
                                Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : null}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => toggleSort("email")}>
                                Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : null}
                            </th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center">No users found</td>
                            </tr>
                        )}

                        {users.map((u) => (
                            <tr key={u.id}>
                                <td style={{ minWidth: 200 }}>{u.name}</td>
                                <td style={{ minWidth: 220 }}>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    <span className={`badge rounded-pill ${u.isActive ? "bg-success" : "bg-danger"}`}>
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <Button size="sm" variant="light" title="View" style={{ color: "blue" }} onClick={() => navigate(`/users/${u.id}`)}>
                                        <Eye />
                                    </Button>{" "}
                                    <Button size="sm" variant="light" title="Edit" style={{ color: "light-blue" }} onClick={() => navigate(`/users/${u.id}/edit`)}>
                                        <Pencil />
                                    </Button>{" "}
                                    <Button
                                        size="sm"
                                        variant="light"
                                        title="Delete"
                                        style={{ color: "red" }}
                                        onClick={() => {
                                            setSelectedId(u.id)
                                            setShowConfirm(true)
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination className="justify-content-center">
                        <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />

                        {/* first page */}
                        <Pagination.Item active={page === 1} onClick={() => setPage(1)}>1</Pagination.Item>

                        {/* left ellipsis */}
                        {page > 3 && <Pagination.Ellipsis />}

                        {/* pages around current */}
                        {Array.from({ length: 4 }).map((_, i) => {
                            const p = page - 1 + i
                            if (p > 1 && p < totalPages) {
                                return (
                                    <Pagination.Item key={p} active={page === p} onClick={() => setPage(p)}>
                                        {p}
                                    </Pagination.Item>
                                )
                            }
                            return null
                        })}

                        {/* right ellipsis */}
                        {page < totalPages - 2 && <Pagination.Ellipsis />}

                        {/* last page */}
                        {totalPages > 1 && (
                            <Pagination.Item active={page === totalPages} onClick={() => setPage(totalPages)}>
                                {totalPages}
                            </Pagination.Item>
                        )}

                        <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                    </Pagination>
                )}

            </div>

            {/* Confirm delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}