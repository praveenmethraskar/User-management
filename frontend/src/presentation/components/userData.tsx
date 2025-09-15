import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUser } from '../../infrastructure/api/api'
import type { User } from '../../infrastructure/model/userModel'

export default function UserData() {
    const { id } = useParams()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (id) {
            getUser(id).then(res => setUser(res.data))
        }
    }, [id])

    if (!user) return <div className="container mt-4">Loading...</div>

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{user.name}</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{user.username}</td>
                            <th>Email</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{user.phone}</td>

                            <th>Website</th>
                            <td>
                                <a href={`http://${user.website}`} target="_blank" rel="noreferrer">
                                    {user.website}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Role</th>
                            <td>{user.role}</td>

                            <th>Status</th>
                            <td>
                                <span className={`badge ${user.isActive ? "bg-success" : "bg-danger"}`}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>Skills</th>
                            <td>
                                {user.skills && user.skills.length > 0 ? (
                                    <ul className="mb-0">
                                        {user.skills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <em>No skills</em>
                                )}
                            </td>

                            <th>Available Slots</th>
                            <td>
                                {user.availableSlots && user.availableSlots.length > 0 ? (
                                    <ul className="mb-0">
                                        {user.availableSlots.map((slot, i) => (
                                            <li key={i}>{new Date(slot).toLocaleString()}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <em>No slots available</em>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Company</th>
                            <td>{user.company.name}</td>
                            <th>Address</th>
                            <td>
                                {user.address.street}, {user.address.city}, {user.address.zipcode}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Link to="/users" className="btn btn-secondary mt-3">
                Back
            </Link>
        </div>

    )
}