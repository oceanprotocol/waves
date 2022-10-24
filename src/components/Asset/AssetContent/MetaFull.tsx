import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'
import Tags from '@shared/atoms/Tags'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()

  // function DockerImage() {
  //   const containerInfo = ddo?.metadata?.algorithm?.container
  //   const { image, tag } = containerInfo
  //   return <span>{`${image}:${tag}`}</span>
  // }

  return ddo ? (
    <>
      {!isInPurgatory && (
        <div className={styles.metaFull}>
          <MetaItem title="Publisher" content={ddo?.metadata?.author} />
          <MetaItem
            title="Album"
            content={ddo?.metadata?.additionalInformation.album}
          />
          <MetaItem
            title="Genre"
            content={
              ddo?.metadata?.additionalInformation.genre
                ? ddo?.metadata?.additionalInformation.genre
                : ddo?.metadata.tags.length > 0 && (
                    <Tags small items={ddo?.metadata?.tags} />
                  )
            }
          />
          <MetaItem
            title="Owned by"
            content={<Publisher account={ddo?.nft?.owner} />}
          />
        </div>
      )}
      {/* <div className={styles.metaFull}>
        {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
          <MetaItem title="Docker Image" content={<DockerImage />} />
        )}
      </div> */}
    </>
  ) : null
}
