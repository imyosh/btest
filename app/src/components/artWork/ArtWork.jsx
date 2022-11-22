import React, { useRef } from 'react'
import './artWork.scss'

import { connect } from 'react-redux'

import { setArtWork } from '../../redux/components/projects/projectsSlice'
import { getBase64 } from '../../funtions'

const ArtWork = ({ artWork, setArtWork }) => {
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const addArt = async () => {
    inputRef.current.click()
  }

  const onChange = (event) => {
    containerRef.current.classList.remove('input--invalid')

    console.log(containerRef.current)

    const files = event.target.files
    if (files.length !== 0) getBase64(files[0], setArtWork)
  }

  return (
    <div ref={containerRef} onClick={addArt} className='artWork'>
      {artWork ? (
        <img className='artWork__img' src={artWork}></img>
      ) : (
        'Add Artwork'
      )}

      <input
        ref={inputRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg, .png, .jpeg'
        onChange={onChange}
      />
    </div>
  )
}

const mapDispatchToProps = { setArtWork }

export default connect(null, mapDispatchToProps)(ArtWork)
