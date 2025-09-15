// src/routes/users.ts
import express from 'express'
import * as userController from '../controller/userController'

const router = express.Router()

/**
 * Supported queries:
 *  GET /api/users?_page=1&_limit=10&_sort=name&_order=asc&q=alice&role=Admin&isActive=true
 */
router.get('/', userController.list)
router.get('/:id', userController.getById)
router.post('/', userController.create)
router.patch('/:id', userController.patch)
router.delete('/:id', userController.remove)

export default router