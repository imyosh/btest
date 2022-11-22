import React, { useState, useEffect } from 'react'
import './myCollaborators.scss'

import { connect } from 'react-redux'

import AddCollaborators from '../addCollaborators/AddCollaborators'
import Collaborator from '../collaborator/Collaborator'

import AddIcon from '../../svg/add.svg'

const MyCollaborators = ({ projects, artistName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [collaborators, setCollaborators] = useState([])

  useEffect(() => {
    console.log(projects)
    setCollaborators(
      projects.data
        .map((project) => project.collaborators)
        .flat()
        .filter((item) => item.artistName !== artistName)
    )
  }, [])

  return (
    <>
      <div className='myCollaborators'>
        <div
          onClick={() => setIsOpen(true)}
          className='collaborator collaborator__add'
        >
          <AddIcon />
        </div>
        {collaborators.map((collaborator, id) => (
          <Collaborator key={id} img={collaborator.Image} id={id} />
        ))}
      </div>

      <AddCollaborators isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  artistName: state.user.user.artistName,
})

export default connect(mapStateToProps)(MyCollaborators)
