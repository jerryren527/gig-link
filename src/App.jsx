import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SignUp from "./features/auth/SignUp";
import LogIn from "./features/auth/LogIn";
import Public from "./components/Public";
import UserList from "./features/users/UsersList";
import Dashboard from "./components/Dashboard";
import Welcome from "./features/auth/Welcome";
import Prefetch from "./features/auth/Prefetch";
import NewUserForm from "./features/users/NewUserForm";
import NewJobForm from "./features/jobs/NewJobForm";
import NotFound from "./components/NotFound";
import EditUser from "./features/users/EditUser";
import JobsList from "./features/jobs/JobsList";
import PersistLogin from "./features/auth/PersistLogin";
import Inbox from "./features/inbox/Inbox";
import NewMessageForm from "./features/inbox/NewMessageForm";
import EditJobForm from "./features/jobs/EditJobForm";
import ProposalsList from "./features/proposals/ProposalsList";
import UserProfile from "./features/users/UserProfile";
import RequestList from "./features/requests/RequestList";
import NewRequestForm from "./features/requests/NewRequestForm";
import RequireAuth from "./features/auth/RequireAuth";
import MyJobsList from "./features/jobs/MyJobsList";
import useTitle from "./hooks/useTitle";
import { ROLES } from "./config/constants";
import "./css/styles.css";

function App() {
	useTitle("Gig-Link | Homepage");
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route index element={<Public />} />
				<Route path="login" element={<LogIn />} />
				<Route path="signup" element={<SignUp />} />

				{/* protected routes */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
						<Route element={<Prefetch />}>
							<Route path="dashboard" element={<Dashboard />}>
								<Route index element={<Welcome />} />
								<Route path="inbox" element={<Inbox />} />
								<Route path="inbox/new" element={<NewMessageForm />} />

								<Route path="users">
									<Route index element={<UserList />} />
									<Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
										<Route path="new" element={<NewUserForm />} />
									</Route>
									<Route path="edit/:userId" element={<EditUser />} />
									<Route path="profile/:userId" element={<UserProfile />} />
								</Route>

								<Route path="jobs">
									<Route index element={<JobsList />} />
									<Route element={<RequireAuth allowedRoles={[ROLES.Client, ROLES.Admin]} />}>
										<Route path="new" element={<NewJobForm />} />
										<Route path="edit/:jobId" element={<EditJobForm />} />
									</Route>
									<Route element={<RequireAuth allowedRoles={[ROLES.Freelancer]} />}>
										<Route path="my-jobs" element={<MyJobsList />} />
									</Route>
								</Route>

								<Route element={<RequireAuth allowedRoles={[ROLES.Freelancer]} />}>
									<Route path="proposals">
										<Route index element={<ProposalsList />} />
									</Route>
								</Route>

								<Route element={<RequireAuth allowedRoles={[ROLES.Client, ROLES.Freelancer]} />}>
									<Route path="requests">
										<Route index element={<RequestList />} />
										<Route path="new/:freelancerId" element={<NewRequestForm />} />
									</Route>
								</Route>
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
