// src/validation/userValidation.ts
import Joi from 'joi'

const phoneRegex = /^\+?[0-9\s-]{7,20}$/

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().required(),
  skills: Joi.array().items(Joi.string().min(2).max(20)).required(),
  availableSlots: Joi.array().items(Joi.string().isoDate()).required(),
  address: Joi.object({
    street: Joi.string().min(3).required(),
    city: Joi.string().min(2).required(),
    zipcode: Joi.string().pattern(/^\d{5,10}$/).required(),
  }).required(),
  company: Joi.object({
    name: Joi.string().min(2).required(),
  }).required(),
  role: Joi.string().valid('Admin', 'Editor', 'Viewer').required(),
})

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  username: Joi.string().min(3).max(20),
  email: Joi.string().email().max(100),
  phone: Joi.string().pattern(phoneRegex),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean(),
  skills: Joi.array().items(Joi.string().min(2).max(20)),
  availableSlots: Joi.array().items(Joi.string().isoDate()),
  address: Joi.object({
    street: Joi.string().min(3),
    city: Joi.string().min(2),
    zipcode: Joi.string().pattern(/^\d{5,10}$/),
  }),
  company: Joi.object({
    name: Joi.string().min(2),
  }),
  role: Joi.string().valid('Admin', 'Editor', 'Viewer'),
}).min(1) // at least 1 field for PATCH