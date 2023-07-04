import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

const Welcome = () => {
  // const { username, role } = useAuth()


  return (
    <>
      <div>Welcome</div>
      <p><Link to="/users">View Freelancers</Link></p>
    </>

  )
}

export default Welcome