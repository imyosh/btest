import React, { useState, useEffect } from 'react'
import './projects.scss'

import { connect } from 'react-redux'

import PageTitle from '../../components/pageTitle/PageTitle'
import Search from '../../components/search/Search'
import List from '../../components/list/List'
import ProjectElement from '../../components/projectElement/ProjectElement'
import AddTagModal from '../../components/addTag/AddTagModal'
import ConfirmModal from '../../components/confrimModal/ConfirmModal'

import { deleteProject } from '../../funtions'

const projects = ({ projects }) => {
  console.log(projects)
  const [search, setSearch] = useState('')
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false)
  const [specificId, setSpecificId] = useState(false)

  const filteredItems =
    search.length === 0
      ? projects
      : projects.filter(
          (item) =>
            item.projectName.toLowerCase().includes(search.toLowerCase()) ||
            item.tags.find((tag) =>
              tag.name.toLowerCase().includes(search.toLowerCase())
            )
        )

  return (
    <div className='projects'>
      <PageTitle title='Projects'></PageTitle>
      <Search setSearch={setSearch} />
      <List
        items={filteredItems}
        Element={ProjectElement}
        ElementProps={{
          setToDeleteProject: (project) => {
            window.testConfirm(
              'Delete Project',
              'Are you sure you want to delete this project ?',
              () => {
                console.log(project._id)
                deleteProject(project)
                  .then((project) => {
                    console.log('project deteted', project.projectName)
                  })
                  .catch((err) => {
                    console.log(err)
                    window.notify()
                  })
              }
            )
          },
        }}
        emptyMessage='No projects'
        customOnClick={(id, isOpen) => {
          setSpecificId(id)
          setIsAddTagModalOpen(isOpen)
        }}
        offset={15}
      />

      <AddTagModal
        isOpen={isAddTagModalOpen}
        setIsOpen={setIsAddTagModalOpen}
        projectId={specificId}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  projects: state.projects.data,
})

export default connect(mapStateToProps)(projects)
