import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteUserMutation, useUpdateUserMutation } from './usersApiSlice'

const EditUserForm = ({ user }) => {
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [role, setRole] = useState(user.role)

  const navigate = useNavigate()

  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateUserMutation();

  const [deleteUser, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteUserMutation();

  useEffect(() => {
    console.log('isSuccess:', isSuccess)
    console.log('isDelSuccess:', isDelSuccess)
    if (isSuccess || isDelSuccess) {
      setUsername('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setRole('')
      navigate('/dashboard/users')
    }

  }, [isSuccess, isDelSuccess, navigate])



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("submitted")
      // if password is provided
      if (password) {
        await updateUser({ id: user.id, username, firstName, lastName, password, role })
      } else {
        await updateUser({ id: user.id, username, firstName, lastName, role })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {
      console.log('deleted')

      await deleteUser({ id: user.id })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h2>EditUserForm</h2>
      <div>
        <button onClick={handleDelete}>Delete User</button>
      </div>
      <form
        className='edit-user-form'
        onSubmit={handleSubmit}
      >
        <div className='edit-user-form__input'>
          <label htmlFor='username-input'>Username: </label>
          <input id="username-input" value={username} type='text' onChange={(e) => setUsername(e.target.value)} />

          <div className='edit-user-form__input'>
            <label htmlFor='password-input'>Password: </label>
            <input id="password-input" value={password} type='password' onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className='edit-user-form__input'>
            <label htmlFor='firstName-input'>First Name: </label>
            <input id="firstName-input" value={firstName} type='text' onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className='edit-user-form__input'>
            <label htmlFor='lastName-input'>Last Name: </label>
            <input id="lastName-input" value={lastName} type='text' onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className='edit-user-form__input'>
            <label htmlFor='role-input'>Role: </label>
            <select id="role-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="Client">Client</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className='btn'>
            <button type='submit'>Save</button>
          </div>
        </div>

      </form>
    </>
  )
}

export default EditUserForm