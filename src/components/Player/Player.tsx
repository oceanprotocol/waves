import { usePlayerContext } from '@context/Player.context'
import useWindowDimensions from '@hooks/useWindowDimensions'
import React, { ReactElement } from 'react'
import AudioPlayer from 'react-h5-audio-player'

import styles from './Player.module.css'

export default function Player(): ReactElement {
  const { song, loading, close, songData } = usePlayerContext()
  const { width } = useWindowDimensions()

  const player = (
    <div className={styles.playerWrapper}>
      <img
        style={{ margin: 0 }}
        width={70}
        height={70}
        src={songData?.coverPicture ?? '/placeholderImage.jpg'}
        alt="cover"
        className={styles.playerCover}
      />
      <AudioPlayer
        src={song}
        layout={width > 600 ? 'horizontal' : 'stacked'}
        autoPlay
        showJumpControls={false}
        className={styles.audioPlayer}
        header={
          <div className={styles.songDetails}>
            {/* <div>album: {songData?.album}</div> */}
            <div>
              <h4 className={styles.songTitle}>{songData?.title}</h4>
              <div>{songData?.artist}</div>
            </div>
          </div>
        }
      />
    </div>
  )

  if (!song) {
    return null
  }

  if (loading) {
    return (
      <div className={styles.loadingRoot}>
        <div className={styles.loadingPlayer}>{player}</div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.closeContainer}>
        <button className={styles.closeButton} onClick={close}>
          ✖
        </button>
      </div>

      {player}
    </div>
  )
}
