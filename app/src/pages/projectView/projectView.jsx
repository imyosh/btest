import React, { useState, useMemo } from 'react'
import './projectView.scss'

import { connect } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router'
import axios from 'axios'

import {
  removeProjectById,
  updateProject,
} from '../../redux/components/projects/projectsSlice'

import PageTitle from '../../components/pageTitle/PageTitle'
import PageNav from '../../components/pageNav/PageNav'
import Pusher from '../../components/pusher/Pusher'
import DeleteIcon from '../../svg/trash-alt.svg'
import ConfirmModal from '../../components/confrimModal/ConfirmModal'

import ProjectDetials from '../../components/projectDetailes/ProjectDetails'
import ProjectTimeline from '../../components/projectTimeline/ProjectTimeline'
import ProjectBounces from '../../components/projectBounces/ProjectBounces'
import ProjectSamples from '../../components/projectSamples/ProjectSamples'
import { deleteProject } from '../../funtions'
import { useNavigate } from 'react-router'

const projectView = ({ projects, activeId, updateProject, userToken }) => {
  const navigate = useNavigate()

  let activeProject = useMemo(
    () => projects.find((project) => project._id === activeId),
    [projects]
  )

  if (!activeProject) {
    activeProject = {
      tags: [],
      samples: [],
      bounces: [],
      collaborators: [],
      artWork: { url: '' },
    }
    // setTimeout(() => {
    navigate('/')
    // }, 100)
  }

  React.useEffect(() => {
    console.log('activeProject', activeProject)

    if (activeProject.isRemoteFiles) {
      axios
        .get(`/api/projects/Get/${activeProject._id}`, {
          headers: {
            'x-access-token': userToken,
          },
        })
        .then(function (response) {
          console.log(response)
          updateProject({
            _id: activeProject._id,
            data: { collaborators: response.data.collaborators },
          })
        })
        .catch(function (error) {
          console.log(error)
          window.api.send('show-error-message', {
            title: '',
            message: error.response.data.message,
          })
        })
    }
  }, [])

  return (
    <div className='projectView'>
      <PageTitle title={activeProject ? activeProject.projectName : ''} />
      <PageNav
        items={[
          { to: 'details', title: 'Details' },
          { to: 'timeline', title: 'Timeline' },
          { to: 'bounces', title: 'Bounces' },
          { to: 'samples', title: 'Samples' },
        ]}
        itemWidth={'4.3rem'}
      >
        <DeleteIcon
          onClick={() =>
            window.testConfirm(
              'Delete Project',
              'Are you sure you want to delete this project ?',
              () => {
                navigate('/')
                deleteProject(activeProject)
                  .then((project) => {
                    console.log('project deteted', project.projectName)
                  })
                  .catch((err) => {
                    console.log(err)
                    window.notify()
                  })
              }
            )
          }
          className='pageNav__icon'
        />
      </PageNav>

      <Routes>
        <Route index element={<Navigate to='details' replace />} />

        <Route
          path={'details'}
          element={
            <ProjectDetials
              activeProject={activeProject ? activeProject : {}}
            />
          }
        ></Route>
        <Route
          path={'timeline'}
          element={<ProjectTimeline activeProject={activeProject} />}
        ></Route>
        <Route
          path={'bounces'}
          element={<ProjectBounces bounces={activeProject.bounces} />}
        ></Route>

        <Route
          path={'samples'}
          element={<ProjectSamples samples={activeProject.samples} />}
        ></Route>
      </Routes>
      <Pusher activeProject={activeProject} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  projects: state.projects.data,
  activeId: state.projects.activeId,
  userToken: state.user.token,
})

const mapDispatchToProps = { updateProject, removeProjectById }

export default connect(mapStateToProps, mapDispatchToProps)(projectView)
