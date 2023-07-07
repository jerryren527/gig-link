import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

const Welcome = () => {
  const { username, role } = useAuth()
  return (
    <>
      <div>Welcome {username} ({role})</div>
      <p><Link to="/dashboard/users">View Freelancers</Link></p>
    </>

  )
}

export default Welcome