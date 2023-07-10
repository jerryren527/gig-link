import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import SignUp from "./features/auth/SignUp/SignUp";
import LogIn from "./features/auth/Login/LogIn";
import Public from "./components/Public";
import UserList from "./features/users/UsersList";
import Dashboard from "./components/Dashboard";
import Welcome from "./features/auth/Welcome";
import Prefetch from "./features/auth/Prefetch";
import NewUserForm from "./features/users/NewUserForm";
import NewJobForm from "./features/jobs/NewJobForm";
import "./css/styles.css";
import NotFound from "./components/NotFound";
import EditUser from "./features/users/EditUser";
import JobsList from "./features/jobs/JobsList";
import PersistLogin from "./features/auth/PersistLogin";
import Inbox from "./features/inbox/Inbox";
import NewMessageForm from "./features/inbox/NewMessageForm";
import EditJobForm from "./features/jobs/EditJobForm";
import ProposalsList from "./features/proposals/ProposalsList";
import ActiveJobsList from "./components/ActiveJobsList";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<LogIn />} />
				<Route path="signup" element={<SignUp />} />

				<Route element={<PersistLogin />}>
					<Route element={<Prefetch />}>
						<Route path="dashboard" element={<Dashboard />}>
							<Route index element={<Welcome />} />
							<Route path="inbox" element={<Inbox />} />
							<Route path="inbox/new" element={<NewMessageForm />} />

							<Route path="users">
								<Route index element={<UserList />} />
								<Route path="new" element={<NewUserForm />} />
								<Route path="edit/:userId" element={<EditUser />} />
							</Route>

							<Route path="jobs">
								<Route index element={<JobsList />} />
								<Route path="new" element={<NewJobForm />} />
								<Route path="active" element={<ActiveJobsList />} />
								<Route path="edit/:jobId" element={<EditJobForm />} />
							</Route>

							<Route path="proposals">
								<Route index element={<ProposalsList />} />
							</Route>
						</Route>
					</Route>
				</Route>

				{/* Matches no patterns above */}
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default App;
