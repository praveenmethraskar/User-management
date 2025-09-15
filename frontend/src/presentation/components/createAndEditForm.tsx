import { Formik, FieldArray, Form as FormikForm, ErrorMessage } from 'formik'
import { Button, Form } from 'react-bootstrap'
import { createUser, getUser, updateUser } from '../../infrastructure/api/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserSchema } from '../../infrastructure/validation/userSchema'
import { toast, ToastContainer } from 'react-toastify'
import type { User } from '../../infrastructure/model/userModel'

export default function CreateAndEditForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [initialValues, setInitialValues] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    isActive: false,
    skills: [''],
    availableSlots: [''],
    address: { street: '', city: '', zipcode: '' },
    company: { name: '' },
    role: 'Viewer',
  })

  useEffect(() => {
    if (id) {
      getUser(id).then(res => setInitialValues(res.data))
    }
  }, [id])

  const handleSubmit = async (values: Partial<User>) => {
    try {
      if (id) {
        await updateUser(id, values)
        toast.success('User updated successfully')
      } else {
        await createUser(values)
        toast.success('User created successfully')
      }
      navigate('/users')
    } catch (err) {
      toast.error('Error saving user')
    }
  }

  return (
    <div className="container mt-4">

    
    <div className="container mt-4">
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={UserSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <FormikForm>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={values.name} onChange={handleChange} />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </Form.Group>

            {/* Username */}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={values.username} onChange={handleChange} />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={values.email} onChange={handleChange} />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={values.phone} onChange={handleChange} />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </Form.Group>

            {/* Website */}
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control name="website" value={values.website || ''} onChange={handleChange} />
              <ErrorMessage name="website" component="div" className="text-danger" />
            </Form.Group>

            {/* Skills */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <FieldArray
                name="skills"
                render={arrayHelpers => (
                  <div>
                    {values.skills?.map((skill, i) => (
                      <div key={i} className="d-flex mb-2">
                        <Form.Control
                          name={`skills.${i}`}
                          value={skill}
                          onChange={handleChange}
                        />
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => arrayHelpers.remove(i)}>-</Button>
                      </div>
                    ))}
                    <Button size="sm" onClick={() => arrayHelpers.push('')}>Add Skill</Button>
                  </div>
                )}
              />
              <ErrorMessage name="skills" component="div" className="text-danger" />
            </Form.Group>

            {/* Available Slots */}
            <Form.Group className="mb-3">
              <Form.Label>Available Slots</Form.Label>
              <FieldArray
                name="availableSlots"
                render={arrayHelpers => (
                  <div>
                    {values.availableSlots?.map((slot, i) => (
                      <div key={i} className="d-flex mb-2">
                        <Form.Control
                          type="datetime-local"
                          name={`availableSlots.${i}`}
                          value={slot}
                          onChange={handleChange}
                        />
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => arrayHelpers.remove(i)}>-</Button>
                      </div>
                    ))}
                    <Button size="sm" onClick={() => arrayHelpers.push('')}>Add Slot</Button>
                  </div>
                )}
              />
              <ErrorMessage name="availableSlots" component="div" className="text-danger" />
            </Form.Group>

            {/* isActive */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                label="Active"
              />
            </Form.Group>

            {/* Address */}
            <h5>Address</h5>
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control name="address.street" value={values.address?.street} onChange={handleChange} />
              <ErrorMessage name="address.street" component="div" className="text-danger" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control name="address.city" value={values.address?.city} onChange={handleChange} />
              <ErrorMessage name="address.city" component="div" className="text-danger" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Zipcode</Form.Label>
              <Form.Control name="address.zipcode" value={values.address?.zipcode} onChange={handleChange} />
              <ErrorMessage name="address.zipcode" component="div" className="text-danger" />
            </Form.Group>

            {/* Company */}
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control name="company.name" value={values.company?.name} onChange={handleChange} />
              <ErrorMessage name="company.name" component="div" className="text-danger" />
            </Form.Group>

            {/* Role */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={values.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </Form.Select>
              <ErrorMessage name="role" component="div" className="text-danger" />
            </Form.Group>

            <Button type="submit">{id ? 'Update' : 'Create'}</Button>
          </FormikForm>
        )}
      </Formik>
      <ToastContainer position="top-right" />
    </div>
    </div>
  )
}