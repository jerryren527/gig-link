import React from 'react'
import { selectAllJobs, useGetJobsQuery } from './jobsApiSlice'
import { useSelector } from 'react-redux'
import NewJobForm from './NewJobForm';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { JOB_STATUSES, ROLES } from '../../config/constants';

const JobsList = () => {
  // const jobs = useSelector(selectAllJobs)
  const { username, role } = useAuth();

  const { data: jobs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetJobsQuery(undefined, {
    pollingInterval: 15000,	// 30 seconds requery the data.
    refetchOnFocus: true,	// if re-focusing on browser window, refetch data
    refetchOnMountOrArgChange: true	// refetch the data when component is re-mounted
  });

  if (!jobs) {
    return <h2>Loading...</h2>
  }

  if (jobs?.ids.length === 0) {
    return <h2>Nothing to see here...</h2>
  }

  let myJobs
  if (role === ROLES.Admin) {
    myJobs = jobs?.ids
  } else if (role === ROLES.Client) {
    myJobs = jobs?.ids.filter(id => jobs.entities[id].clientUsername === username)
  } else if (role === ROLES.Freelancer) {
    myJobs = jobs?.ids.filter(id => jobs.entities[id].status === JOB_STATUSES.Pending)
  }

  let header
  if (role === ROLES.Admin) {
    header = "All Jobs"
  } else if (role === ROLES.Client) {
    header = "My Open Jobs"
  } else if (role === ROLES.Freelancer) {
    header = "All Open Jobs"
    myJobs = jobs?.ids.filter(id => jobs.entities[id].status === JOB_STATUSES.Pending)
  }

  console.log('myJobs', myJobs)

  return (
    <>
      <h2>{header}</h2>
      <Link to="/dashboard/jobs/new">Make Job Posting</Link>
      <br />
      <div>
        {myJobs && myJobs.map(id => {

          const job = jobs.entities[id]
          return (
            job && (
              <div key={job.id}>
                <p>{job.id}</p>
                <p>{job.title}</p>
                <p>{job.description}</p>
                <p>{job.client}</p>
                <p>{job.clientUsername}</p>
                <p>{job.skills.map((skill, index) => {
                  if (index == job.skills.length - 1) {
                    return <span key={`${job.id}-${index}`}>{skill}</span>
                  }
                  return <span key={`${job.id}-${index}`}>{skill}, </span>
                })}
                </p>
                <p>{job.price}</p>
                <p>{job.startDate}</p>
                <p>{job.dueDate}</p>

                {job.clientUsername === username && <Link to={`/dashboard/jobs/edit/${job.id}`}>Edit Job</Link>}
                <hr />
              </div>
            )
          )
        })}
      </div>
    </>
  )
}

export default JobsList