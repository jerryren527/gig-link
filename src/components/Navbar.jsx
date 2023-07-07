import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // If at /inbox, do not show Inbox link
  const atHome = pathname === `/`
  const atInbox = pathname === `/inbox`
  const atLogIn = pathname === `/login`
  const atSignUp = pathname === `/signup`

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error }
  ] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])

  if (isLoading) {
    return <p>Logging Out...</p>
  }

  if (isError) {
    return <p>Error: {error.data?.message}</p>
  }

  console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ atInbox:", atInbox)
  return (
    <>
      <div className='navbar'>
        <div className='navbar__links'>
          {!atHome ? <Link className="navbar__link" to='/'>Home</Link> : <div>&nbsp;</div>}
        </div>

        <div className='navbar__links'>
          <Link className="navbar__link" to='/dashboard'>Dashboard</Link>
          {!atInbox && <Link className="navbar__link" to='/dashboard/inbox'>Inbox</Link>}
          {!atLogIn && <Link className="navbar__link" to='/login'>Login</Link>}
          {!atSignUp && <Link className="navbar__link" to='/signup'>Sign Up</Link>}
          <Link className="navbar__link" onClick={sendLogout}>Logout</Link>
        </div>

      </div>
    </>
  )
}

export default Navbar