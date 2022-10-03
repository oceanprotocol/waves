import { usePlayerContext } from '@context/Player.context'
import React, { ReactElement } from 'react'
import AudioPlayer from 'react-h5-audio-player'

import s from './Player.module.css'

export default function Player(): ReactElement {
  const { song, loading, close } = usePlayerContext()

  if (loading) {
    return (
      <div className={s.loadingRoot}>
        <div className={s.loadingPlayer}>
          <AudioPlayer autoPlay src={song} />
        </div>
      </div>
    )
  }

  if (!song) {
    return null
  }

  return (
    <div className={s.root}>
      <div className={s.closeContainer}>
        <button className={s.closeButton} onClick={close}>
          ✖
        </button>
      </div>
      <AudioPlayer autoPlay src={song} />
    </div>
  )
}
