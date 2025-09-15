// src/model/user.ts
export type Role = 'Admin' | 'Editor' | 'Viewer'

export interface Address {
  street: string
  city: string
  zipcode: string
}

export interface Company {
  name: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  website?: string | null
  isActive?: boolean
  skills: string[]
  availableSlots: string[] 
  address: Address
  company: Company
  role: Role
  createdAt?: string
  updatedAt?: string
}
