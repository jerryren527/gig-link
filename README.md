# Gig Link

## Overview

Gig Link is a full-stack web application that serves as a platform connecting freelancers and clients for project collaboration. Built using the MERN stack (**MongoDB**, **Express.js**, **React.js**, **Node.js**), **Redux**, **Redux Toolkit**, **RTK Query**, and **Sass**, Gig Link provides a seamless and secure experience for users.

## Demo Credentials

To explore the features of Gig Link, you can use the following demo credentials:

**Client**

- Username: `guest.client`
- Password: `123123`

**Freelancer**

- Username: `guest.freelancer`
- Password: `123123`

**Admin**

- Username: `guest.admin`
- Password: `123123`

## Authentication Flow

Gig Link employs a secure authentication flow to ensure the privacy and authorization of its users. Here's a breakdown of the authentication process:

1. **Login**: Click on the "Login" button and enter your username and password. The entered password is compared to the hashed password stored in the database using the bcrypt library. Upon a successful match, a JSON Web Token (JWT) is generated, containing the necessary user information in its payload. This JWT is securely sent to the browser as a same-site and secure cookie. The JWT serves as authorization for executing authorized operations on the website.

2. **Sign Up**: Alternatively, users can click on "Sign Up" to create a new account. Provide a username, password, first name, last name, and select a role. After filling in the required information, click "Sign Up." If the provided credentials are valid, you will be redirected to the Login page, where you can log in with your newly created account.

3. **Dashboard**: After successfully logging in, users are directed to their respective dashboards, which contain operations specific to their roles.

## Security Highlights

Gig Link prioritizes the security of user data:

- **Password Hashing**: User passwords are securely hashed using bcrypt, ensuring they are never stored in plain text. This protects against unauthorized access and strengthens the platform's overall security.

- **JWT-based Authentication**: Gig Link utilizes JSON Web Tokens (JWT) for secure user authentication. JWTs are encrypted, digitally signed, and transmitted as secure, same-site cookies. This approach ensures data integrity, guards against tampering, and mitigates common web vulnerabilities like XSS and CSRF attacks.

## Overview of User Operations

Gig Link offers a range of operations for each user's role:

**Client**

- Create and edit job posts

<img src="images/client_make-job.gif" width="600" alt="client creating a job post">

- Make job requests to freelancers

<img src="images/client_make-request.gif" width="600" alt="client making a job request">

- Review and rate freelancers, and delete reviews

<img src="images/client_make-review.gif" width="600" alt="client making a freelancer review">

- Accept or decline proposals from freelancers
- Mark jobs as completed or cancelled

<img src="images/freelancer_add-proposal_accept-decline-job_mark-as-complete.gif" width="900" alt="client accepting and declining freelancer proposals for job">

**Freelancer**

- View open job posts and make proposals
- Accept or decline job requests from clients

<img src="images/freelancer_accept-decline-requests.gif" width="900" alt="freelancer accepting and declining client requests">

**Admin**

- Delete other users and jobs

<img src="images/admin_delete-user.gif" width="900" alt="admin deleting a user">

**All Users**

- View and edit their own profiles

<img src="images/client_edit-profile.gif" width="600" alt="client editing profile">

<img src="images/freelancer-edit-profile.gif" width="600" alt="freelancer editing profile">

- Search for users by username
- Delete their own accounts
- Send messages to other users on the platform

<img src="images/client-and-freelancer__inbox-sped-up.gif" width="900" alt="freelancer and client exchanging messages">
