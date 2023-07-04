import React, { useEffect, useState } from 'react'
import { useAddUserMutation } from './usersApiSlice'

const NewUserForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')

  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddUserMutation()

  useEffect(() => {
    if (isSuccess) {
      alert(`User ${username} added successfully.`)
      setUsername('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setRole('')
    }
    if (isError) {
      alert(`Error: ${error?.data?.message}`)
    }
  }, [isSuccess, isError, error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitted!')
    await addNewUser({ username, password, firstName, lastName, role })
  }

  return (
    <>
      <h2>New User Form</h2>
      <form
        className='new-user-form'
        onSubmit={handleSubmit}
      >
        <div className='new-user-form__input'>
          <label htmlFor='username-input'>Username: </label>
          <input id="username-input" value={username} type='text' onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className='new-user-form__input'>
          <label htmlFor='password-input'>Password: </label>
          <input id="password-input" value={password} type='password' onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className='new-user-form__input'>
          <label htmlFor='firstName-input'>First Name: </label>
          <input id="firstName-input" value={firstName} type='text' onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className='new-user-form__input'>
          <label htmlFor='lastName-input'>Last Name: </label>
          <input id="lastName-input" value={lastName} type='text' onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className='new-user-form__input'>
          <label htmlFor='role-input'>Role: </label>
          <select id="role-input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className='btn'>
          <button type='submit'>Add User</button>
        </div>
      </form>
    </>
  )
}

export default NewUserForm

// const { username, password, firstName, lastName, role } = req.body