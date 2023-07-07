import React from 'react'
import { useSelector } from 'react-redux'
import { selectMessageById, useGetMessagesQuery } from '../messages/messagesApiSlice'
import { selectUserById } from '../users/usersApiSlice';

const Messages = ({ messages }) => {
  // use RTK Query generated hooks instead of generated selectors. selectors are selecting nothing sometimes.
  const { data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessagesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,	// if re-focusing on browser window, refetch data
    refetchOnMountOrArgChange: true	// refetch the data when component is re-mounted);
  })


  let content
  if (messages) {
    if (messages.length === 0) {
      content = <p>Nothing available here...</p>
    }
    else {
      content = messages.map(id => {
        // const message = useSelector(state => selectMessageById(state, id))
        const message = data?.entities[id]
        return (
          <div className='message-container'>
            <p>{message?.title}</p>
            <p>{message?.body}</p>
            <p>{message?.senderUsername}</p>
            <p>{message?.recipientUsername}</p>
            <hr />
          </div>
        )
      })
    }
  }

  return (
    <div>{content}</div>
  )
}

export default Messages