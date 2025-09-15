export const ROUTES = {
  USERS: '/users',
  USER_DETAILS: (id: string) => `/users/${id}`,
  USER_CREATE: '/users/create',
  USER_EDIT: (id: string) => `/users/${id}/edit`,
}