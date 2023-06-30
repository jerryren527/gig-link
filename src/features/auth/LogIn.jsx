import React, { useState } from 'react'
import { LogInForm } from './LogIn.styles'

const LogIn = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted!')
  }
  return (
    <>
      <LogInForm
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor='username-input'>Username: </label>
          <input id="username-input" name="username" value={username} type='text' onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor='password-input'>Password: </label>
          <input id="password-input" name="password" value={password} type='password' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button type='submit'>Log In</button>
        </div>
      </LogInForm>
    </>
  )
}

export default LogIn