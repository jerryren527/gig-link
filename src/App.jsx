import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import Inbox from './components/Inbox'
import SignUp from './features/auth/SignUp/SignUp'
import LogIn from './features/auth/Login/LogIn'
import Public from './components/Public'
import UserList from './features/users/UsersList'
import Dashboard from './components/Dashboard'
import Welcome from './features/auth/Welcome'
import Prefetch from './features/auth/Prefetch'
import NewUserForm from './features/users/NewUserForm'
import "./css/styles.css"
import NotFound from './components/NotFound'
import EditUser from './features/users/EditUser'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Public />} />
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="inbox" element={<Inbox />} />


        <Route element={<Prefetch />}>
          <Route path='dashboard' element={<Dashboard />}>
            <Route index element={<Welcome />} />

            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="new" element={<NewUserForm />} />
              <Route path="edit/:userId" element={<EditUser />} />
            </Route>

          </Route>
        </Route>

        {/* Matches no patterns above */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  )
}

export default App
