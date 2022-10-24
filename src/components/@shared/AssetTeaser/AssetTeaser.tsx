import React, { ReactElement } from 'react'
import Link from 'next/link'
// import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
// import removeMarkdown from 'remove-markdown'
// import Publisher from '@shared/Publisher'
// import AssetType from '@shared/AssetType'
// import NetworkName from '@shared/NetworkName'
import styles from './AssetTeaser.module.css'
// import { getServiceByName } from '@utils/ddo'
import cx from 'classnames'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
  trendingList?: boolean
}

export default function AssetTeaser({
  asset,
  // noPublisher,
  trendingList
}: AssetTeaserProps): ReactElement {
  const { name, additionalInformation } = asset.metadata
  return (
    <article
      className={cx(styles.teaser, trendingList && styles.trendingAsset)}
    >
      <div className={styles.container}>
        <Link href={`/asset/${asset.id}`}>
          <a className={styles.link}>
            <div
              className={styles.assetimage}
              style={{
                backgroundImage: `url(${
                  additionalInformation.coverPicture ?? '/placeholderImage.jpg'
                })`
              }}
            >
              {!trendingList && (
                <div className={styles.priceDesktop}>
                  <Price accessDetails={asset.accessDetails} size="small" />
                </div>
              )}
            </div>
            <div className={styles.assetInfo}>
              <h2 className={styles.assetName} title={name}>
                {name}
              </h2>
              <p className={styles.assetArtists}>
                {additionalInformation.artist}
              </p>
              <div className={styles.priceInfoMobile}>
                <Price accessDetails={asset.accessDetails} size="small" />
              </div>
            </div>
          </a>
        </Link>
      </div>
    </article>
  )
}
