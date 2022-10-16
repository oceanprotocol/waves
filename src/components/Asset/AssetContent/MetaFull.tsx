import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()

  function DockerImage() {
    const containerInfo = ddo?.metadata?.algorithm?.container
    const { image, tag } = containerInfo
    return <span>{`${image}:${tag}`}</span>
  }

  return ddo ? (
    <>
      {!isInPurgatory && (
        <div className={styles.metaFull}>
          <MetaItem title="Publisher" content={ddo?.metadata?.author} />

          <MetaItem
            title="Artist"
            content={ddo?.metadata?.additionalInformation.artist}
          />
          <MetaItem
            title="Title"
            content={ddo?.metadata?.additionalInformation.title}
          />
          <MetaItem
            title="Album"
            content={ddo?.metadata?.additionalInformation.album}
          />
          <MetaItem
            title="Genre"
            content={ddo?.metadata?.additionalInformation.genre}
          />
          <img
            style={{ margin: 0 }}
            width={100}
            height={100}
            src={ddo?.metadata.additionalInformation.coverPicture}
            alt="cover"
          />
          <br />
        </div>
      )}
      <div className={styles.metaFull}>
        <MetaItem
          title="Owner"
          content={<Publisher account={ddo?.nft?.owner} />}
        />

        {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
          <MetaItem title="Docker Image" content={<DockerImage />} />
        )}
        <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
      </div>
    </>
  ) : null
}
