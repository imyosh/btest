import React, { useState, useRef } from 'react'
import './audioElement.scss'

import AudioPlayer from 'react-h5-audio-player'

import 'react-h5-audio-player/lib/styles.css'
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

import { connect } from 'react-redux'
import path from 'path'

import PlayIcon from '../../svg/music-play.svg'
import PauseIcon from '../../svg/music-pause.svg'

const AudioElement = ({ item, homeFolderPath }) => {
  const playerRef = useRef(null)
  const playBtnRef = useRef(null)
  const pauseBtnRef = useRef(null)

  const [audioURL, setAudioURL] = useState('')

  const play = (e) => {
    playBtnRef.current.style.display = 'none'
    pauseBtnRef.current.style.display = 'flex'

    if (!audioURL) {
      let binary = window.api.readFile(path.join(homeFolderPath, item.path))
      var blob = new Blob([binary], { type: 'audio/ogg' })
      var blobUrl = URL.createObjectURL(blob)
      setAudioURL(blobUrl)
    } else playerRef.current.audio.current.play()
  }

  const pause = (e) => {
    playBtnRef.current.style.display = 'flex'
    pauseBtnRef.current.style.display = 'none'
    playerRef.current.audio.current.pause()
  }

  return (
    <div className='audioElement'>
      <div className='audioElement__icon'>
        <div onClick={play} ref={playBtnRef}>
          <PlayIcon />
        </div>
        <div onClick={pause} style={{ display: 'none' }} ref={pauseBtnRef}>
          <PauseIcon />
        </div>
      </div>

      <span className='audioElement__title'>{item.title}</span>
      {audioURL ? (
        <AudioPlayer
          autoPlay={true}
          src={audioURL}
          showFilledVolume
          onPlay={(e) => console.log('paying')}
          onEnded={() => setAudioURL('')}
          // other props here
          ref={playerRef}
          showJumpControls={false}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  homeFolderPath: state.homeFolderPath,
})

export default connect(mapStateToProps)(AudioElement)
