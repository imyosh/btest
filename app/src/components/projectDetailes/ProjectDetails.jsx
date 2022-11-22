import React, { useState } from 'react'
import './projectDetails.scss'

import Collaborator from '../collaborator/Collaborator'
import ProjectTags from '../projectTags/ProjectTags'
import ArtWork from '../artWork/ArtWork'
import AddIcon from '../../svg/add.svg'
import AddCollaborators from '../addCollaborators/AddCollaborators'
import AddTagModal from '../addTag/AddTagModal'

const ProjectDetials = ({ activeProject }) => {
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] =
    useState(false)

  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false)

  return (
    <div className='projectDetails'>
      <div className='projectDetails__title'>Collaborators</div>
      <div className='projectDetails__collaborators horizontal-list-body'>
        <div
          onClick={() => setIsAddCollaboratorModalOpen(true)}
          className='collaborator collaborator__add'
        >
          <AddIcon />
        </div>
        {activeProject.collaborators.map((collaborator, id) => (
          <Collaborator key={id} img={collaborator.Image} id={id} />
        ))}
      </div>

      <div className='projectDetails__title projectDetails__title--tags'>
        Tags
      </div>

      <ProjectTags
        tags={activeProject.tags}
        showAdd={true}
        openAddTagModal={setIsAddTagModalOpen}
      />

      <AddTagModal
        isOpen={isAddTagModalOpen}
        setIsOpen={setIsAddTagModalOpen}
        projectId={activeProject._id}
      />

      <ArtWork artWork={activeProject.artWork} />

      <AddCollaborators
        isOpen={isAddCollaboratorModalOpen}
        setIsOpen={setIsAddCollaboratorModalOpen}
        projectId={activeProject._id}
      />
    </div>
  )
}

export default ProjectDetials
