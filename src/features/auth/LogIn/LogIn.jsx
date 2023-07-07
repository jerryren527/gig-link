import React, { useState } from 'react'
import { LogInForm } from './LogIn.styles'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../authApiSlice'
import { setCredentials } from '../authSlice'

const LogIn = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 'login' is the mutation function, 'isLoading' is a destructured property from the hook's result.
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submitted!')

    try {
      const { accessToken } = await login({ username, password }).unwrap(); // use .unwrap() because RTK query comes with its own error handling methods. If you do not want to use them and instead use try-catch blocks, use .unwrap()

      console.log('accessToken', accessToken)
      dispatch(setCredentials({ accessToken })) // set state.accessToken = accessToken
      setUsername("")
      setPassword("")
      navigate('/dashboard') // navigating to another page invokes api/mutations/removeMutationResults action, which clears auth.state.token
    } catch (err) {
      if (!err.status) {
        // the only time 'err' will have no status is if there was no server response.
        console.log("No Server Response");
      } else if (err.status === 400) {
        console.log("Missing Username or Password");
      } else if (err.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log(err.data?.message);
      }
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <>
      <h2>Login</h2>
      <form
        className='login-form'
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor='username-input'>Username: </label>
          <input id="username-input" name="username" value={username} type='text' onChange={(e) => setUsername(e.target.value)} autoCorrect='off' required />
        </div>
        <div>
          <label htmlFor='password-input'>Password: </label>
          <input id="password-input" name="password" value={password} type='password' onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <button type='submit'>Log In</button>
        </div>
      </form>
    </>
  )
}

export default LogIn