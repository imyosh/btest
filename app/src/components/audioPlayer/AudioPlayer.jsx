import React from 'react'
import './audioPlayer.scss'

import Bar from './Bar'

import useAudioPlayer from './useAudioPlayer'

function AudioPlayer({ src }) {
  const { curTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer()

  console.log(src)

  return (
    <div className='player'>
      <audio id='audio'>
        <source src={src} />
      </audio>

      <div className='controls'>
        {playing ? (
          <div onClick={() => setPlaying(false)}>Pause</div>
        ) : (
          <div onClick={() => setPlaying(true)}>Play</div>
        )}
        <Bar
          curTime={curTime}
          duration={duration}
          onTimeUpdate={(time) => setClickedTime(time)}
        />
      </div>
    </div>
  )
}

export default AudioPlayer
