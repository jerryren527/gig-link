import { Routes, Route } from 'react-router-dom'
import LogIn from "./features/auth/LogIn"
import Layout from './components/Layout'
import Navbar from './components/Navbar/Navbar'
import Inbox from './components/Inbox/Inbox'
import SignUp from './features/auth/SignUp'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="inbox" element={<Inbox />} />
      </Route>
    </Routes>
  )
}

export default App
