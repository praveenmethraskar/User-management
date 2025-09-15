import * as Yup from 'yup'

const phoneRegex = /^\+?[0-9\s-]{7,20}$/

export const UserSchema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required('Name is required'),
  username: Yup.string().min(3).max(20).required('Username is required'),
  email: Yup.string().email('Invalid email').max(100).required('Email is required'),
  phone: Yup.string().matches(phoneRegex, 'Invalid phone').max(20).required('Phone is required'),
  website: Yup.string().url('Invalid URL').max(100).nullable(),
  skills: Yup.array().of(
    Yup.string().min(2).max(10, 'Each skill 2–10 chars')
  ).min(1, 'At least one skill required'),
  availableSlots: Yup.array().of(
    Yup.date().min(new Date(), 'Must be a future date').required()
  ).min(1, 'At least one slot required'),
  isActive: Yup.boolean().default(false),
  address: Yup.object({
    street: Yup.string().min(5).max(100).required('Street is required'),
    city: Yup.string().min(2).max(50).required('City is required'),
    zipcode: Yup.string().matches(/^\d{5,10}$/, '5–10 digits').required('Zipcode is required'),
  }),
  company: Yup.object({
    name: Yup.string().min(2).max(100).required('Company name is required'),
  }),
  role: Yup.mixed<'Admin' | 'Editor' | 'Viewer'>().oneOf(['Admin','Editor','Viewer']).required('Role is required'),
})