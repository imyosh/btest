import React from 'react'
import './projectSamples.scss'

import List from '../list/List'
import AudioElement from '../audioElement/AudioElement'

const ProjectSamples = ({ samples }) => {
  return (
    <div className='projectSamples'>
      <List
        items={samples ? samples : []}
        Element={AudioElement}
        emptyMessage='No Samples'
        offset={1}
      />
    </div>
  )
}

export default ProjectSamples
