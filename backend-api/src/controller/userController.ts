// src/controller/userController.ts
import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/userService'
import { createUserSchema, updateUserSchema } from '../validation/userValidation'
import { listUsers } from '../services/userService'

// src/controllers/userController.ts  (or wherever the list handler is)
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, total } = await userService.listUsers({
      _page: req.query._page ? Number(req.query._page) : undefined,
      _limit: req.query._limit ? Number(req.query._limit) : undefined,
      _sort: req.query._sort as string,
      _order: (req.query._order as 'asc'|'desc') ?? 'asc',
      q: req.query.q as string,
      role: req.query.role as string,
      isActive: req.query.isActive as string,
    })

    // expose header and make it available to browser JS
    res.setHeader('X-Total-Count', String(total))
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')

    return res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const user = await userService.getUserById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json(user)
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      stripUnknown: true,
    })
    if (error) return res.status(400).json({ message: error.message })
    const created = await userService.createUser(value)
    return res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

export async function patch(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const { error, value } = updateUserSchema.validate(req.body, {
      stripUnknown: true,
    })
    if (error) return res.status(400).json({ message: error.message })
    const updated = await userService.updateUser(id, value)
    if (!updated) return res.status(404).json({ message: 'User not found' })
    return res.json(updated)
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const ok = await userService.deleteUser(id)
    if (!ok) return res.status(404).json({ message: 'User not found' })
    return res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}