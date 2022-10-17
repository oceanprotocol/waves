import { usePlayerContext } from '@context/Player.context'
import React, { ReactElement } from 'react'
import AudioPlayer from 'react-h5-audio-player'

import s from './Player.module.css'

export default function Player(): ReactElement {
  const { song, loading, close, songData } = usePlayerContext()
  console.log('song', song)

  const player = (
    <AudioPlayer
      src={song}
      // layout="horizontal"
      header={
        <div className={s.songDetails}>
          <div>album: {songData?.album}</div>
          <img
            style={{ margin: 0 }}
            width={60}
            height={60}
            src={songData?.coverPicture}
            alt="cover"
          />
          <div>
            <div>{songData?.artist}</div>
            <div>{songData?.title}</div>
          </div>
        </div>
      }
    />
  )

  if (!song) {
    return null
  }

  if (loading) {
    return (
      <div className={s.loadingRoot}>
        <div className={s.loadingPlayer}>{player}</div>
      </div>
    )
  }

  return (
    <div className={s.root}>
      <div className={s.closeContainer}>
        <button className={s.closeButton} onClick={close}>
          ✖
        </button>
      </div>

      {player}
    </div>
  )
}
