import React, { useEffect, useState } from 'react'
import './collaboratorsRequests.scss'

import List from '../list/List'
import CollaboratorsRequestElement from '../collaboratorsRequestsElement/CollaboratorsRequestElement'

import { getAllReceivedRequests } from '../../funtions/crud'
import BoxesSpinner from '../spinners/BoxesSpinner'

import { connect } from 'react-redux'
import { appendRemoteProject } from '../../redux/components/projects/projectsSlice'

const CollaboratorsRequests = ({ appendRemoteProject }) => {
  const [receivedRequests, setReceivedRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const updateRequest = (requestId, data) => {
    setReceivedRequests(
      receivedRequests.map((request) =>
        request._id === requestId ? { ...request, ...data } : request
      )
    )
  }

  useEffect(() => {
    getAllReceivedRequests()
      .then(function (response) {
        console.log(response)
        setIsLoading(false)

        setReceivedRequests(response.data.reverse())
      })
      .catch(function (error) {
        setIsLoading(false)
        console.log(error)
        window.api.send('show-error-message', {
          title: '',
          message: error.message,
        })
      })
  }, [])

  return (
    <div className='collaboratorsRequests'>
      {isLoading ? (
        <BoxesSpinner center={true} />
      ) : (
        <List
          items={receivedRequests}
          Element={CollaboratorsRequestElement}
          emptyMessage='No Requests'
          // customOnClick={(id, isOpen) => {}}
          marginTop='2rem'
          ElementProps={{ updateRequest }}
        />
      )}
    </div>
  )
}

export default CollaboratorsRequests
