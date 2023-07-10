import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from './usersApiSlice'
import EditUserForm from './EditUserForm'

const EditUser = () => {
  const { userId } = useParams()

  // First arg is a unique key used to cache this paritcular query result in the redux store. Wehen the same request is made, RTK Query will check if data for this query already exists in the redux store by looking up this unique key. If data exists, use the cached data instead of making a new API call.
  // The selectFromResult option is RTK Query specific that allows you to customize the data that gets selected and stored in the redux store as a result of the query.
  // useGetUsersQuery() returns Object { user: {...}, refretch: refetch() }. So we destructure user from it.
  // Also note that we are using useGetUsersQuery() hook instead of the RTK Query's automatically generated selectors (which requires the use of useSelector). I think this is a matter of preference, as both options work.
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({  // Destructure out the 'data' property of the query result object
      user: data?.entities[userId]
    })
  })

  if (!user) {
    return <h2>Loading...</h2>
  }

  let content = <EditUserForm user={user} />

  return content;
}

export default EditUser