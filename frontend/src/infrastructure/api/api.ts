import http from '../http'
import type { User } from '../model/userModel'

export const fetchUsers = (params?: any) =>
  http.get<User[]>('/users', { params })

export const getUser = (id: string) =>
  http.get<User>(`/users/${id}`)

export const createUser = (data: Partial<User>) =>
  http.post<User>('/users', data)

export const updateUser = (id: string, data: Partial<User>) =>
  http.patch<User>(`/users/${id}`, data)

export const deleteUser = (id: string) =>
  http.delete(`/users/${id}`)