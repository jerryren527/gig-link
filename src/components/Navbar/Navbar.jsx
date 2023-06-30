import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavbarContainer, StyledAnchor } from './Navbar.styles'

const Navbar = () => {
  const { pathname } = useLocation()
  // If at /inbox, do not show Inbox link
  const atInbox = pathname === `/inbox`
  const atLogIn = pathname === `/login`
  const atSignUp = pathname === `/signup`

  console.log("🚀 ~ file: Navbar.jsx:10 ~ Navbar ~ atInbox:", atInbox)

  return (
    <>
      <NavbarContainer>
        {!atInbox && <StyledAnchor href='/inbox'>Inbox</StyledAnchor>}
        {!atLogIn && <StyledAnchor href='/login'>Login</StyledAnchor>}
        {!atSignUp && <StyledAnchor href='/signup'>Sign Up</StyledAnchor>}
        <StyledAnchor>Logout</StyledAnchor>

      </NavbarContainer>
    </>
  )
}

export default Navbar