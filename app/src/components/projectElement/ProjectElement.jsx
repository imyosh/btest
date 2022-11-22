import React, { useState } from 'react'
import './projectElement.scss'

import { connect } from 'react-redux'
import { useNavigate } from 'react-router'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

import { setActiveProject } from '../../redux/components/projects/projectsSlice'

import ProjectTags from '../projectTags/ProjectTags'
import FolderIcon from '../../svg/folder-exclamation.svg'
import BoxesSpinner from '../spinners/BoxesSpinner'

const ProjectElement = ({
  item,
  artistName,
  setActiveProject,
  customOnClick,
  setToDeleteProject,
}) => {
  const navigate = useNavigate()

  const openProject = () => {
    setActiveProject(item._id)
    navigate('/project-view')
  }

  return (
    <ContextMenuTrigger
      attributes={{ style: { position: 'relative' }, id: item._id }}
      id={item._id}
    >
      <div
        id={'projectElement' + item._id}
        onClick={openProject}
        className='projectElement'
      >
        <div className='projectElement__container'>
          <div className='projectElement__title'>{item.projectName}</div>
          <div className='projectElement__discription'>
            created by{' '}
            <span className='bold white'>
              {item.artistName === artistName ? 'You' : item.artistName}
            </span>
            {' on '}
            <span className='bold white'>
              {new Date(item.createdAt).toLocaleString()}
              {/* {item.date} {item.time} */}
            </span>
          </div>
          <div className='projectElement__icons'>
            {item.isLocalFiles ? null : (
              <FolderIcon className='projectElement__icon projectElement__icon--yellow' />
            )}
            {item.isRemoteFiles ? null : (
              <FolderIcon className='projectElement__icon projectElement__icon--red' />
            )}
          </div>
        </div>
        <ProjectTags
          tags={item.tags}
          openAddTagModal={(isOpen) => customOnClick(item._id, isOpen)}
        />

        <div className='projectElement__deletingIcon'>
          <BoxesSpinner color={'rgb(255, 86, 86)'} />
        </div>
      </div>

      <ContextMenu id={item._id}>
        <MenuItem onClick={() => setToDeleteProject(item)}>
          Delete Project
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  )
}

const mapStateToProps = (state) => ({
  artistName: state.user.user.artistName,
})

const mapDispatchToProps = { setActiveProject }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectElement)
