import React from 'react'
import { Link } from 'react-router-dom'

const Public = () => {
  return (
    <>
      <div>
        <h1>Welcome to Gig-Link</h1>
        <h2>Where Freelancers and Clients Unite for Limitless Projects</h2>
        <div>
          <Link to="/users">View Freelancers</Link>
        </div>
        <div>
          <a>View Open Job Postings</a>
        </div>
      </div>
    </>
  )
}

export default Public