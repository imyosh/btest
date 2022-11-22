import React, { useState } from 'react'
import './collaborators.scss'

import { Routes, Route, Navigate } from 'react-router'

import PageTitle from '../../components/pageTitle/PageTitle'
import PageNav from '../../components/pageNav/PageNav'
import MyCollaborators from '../../components/myCollaborators/MyCollaborators'
import CollaboratorsRequests from '../../components/collaboratorsRequests/CollaboratorsRequests'

const Collaborators = () => {
  return (
    <div className='collaborators'>
      <PageTitle title='Collaborators' />
      <PageNav
        items={[
          { to: 'myCollaborators', title: 'My Collaborators' },
          { to: 'requests', title: 'Requests' },
        ]}
        itemWidth={'8.5rem'}
      />
      <Routes>
        <Route index element={<Navigate to='myCollaborators' replace />} />
        <Route path={'myCollaborators'} element={<MyCollaborators />}></Route>
        <Route path={'requests'} element={<CollaboratorsRequests />}></Route>
      </Routes>
    </div>
  )
}

export default Collaborators
