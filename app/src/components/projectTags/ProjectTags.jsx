import React from 'react'
import './projectTags.scss'

const ProjectTags = ({ tags, showAdd, openAddTagModal }) => {
  return (
    <div className='projectTags'>
      {showAdd && tags.length !== 0 ? (
        <div
          onClick={(e) => {
            e.stopPropagation()
            openAddTagModal(true)
          }}
          className='projectTags__element projectTags__element--addTag'
        >
          Add Tag
        </div>
      ) : null}
      {tags.length !== 0 ? (
        tags.map(({ name, color }, id) => (
          <div key={id} className='projectTags'>
            <div style={{ background: color }} className='projectTags__element'>
              {name}
            </div>
          </div>
        ))
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation()
            openAddTagModal(true)
          }}
          className='projectTags__element projectTags__element--addTag'
        >
          Add Tag
        </div>
      )}
    </div>
  )
}

export default ProjectTags
