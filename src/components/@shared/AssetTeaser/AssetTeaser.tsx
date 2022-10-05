import React, { ReactElement } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './AssetTeaser.module.css'
import { getServiceByName } from '@utils/ddo'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
}

export default function AssetTeaser({
  asset,
  noPublisher
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { orders } = asset.stats

  return (
    <article className={`${styles.teaser}`}>
      <div className={styles.container}>
        <Link href={`/asset/${asset.id}`}>
          <a className={styles.link}>
            {/* <header className={styles.header}>
              <div className={styles.symbol}>{datatokens[0]?.symbol}</div>
              <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
                {name.slice(0, 200)}
              </Dotdotdot>
            </header> */}
            {!noPublisher && (
              <Publisher account={owner} minimal className={styles.publisher} />
            )}
            <AssetType
              type={type}
              accessType={accessType}
              className={styles.typeDetails}
              totalSales={orders}
            />

            <div className={styles.content}>
              <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
                {name.slice(0, 200)}
              </Dotdotdot>
              <Dotdotdot tagName="p" clamp={3}>
                {removeMarkdown(description?.substring(0, 300) || '')}
              </Dotdotdot>
            </div>

            <footer className={styles.foot}>
              {/* <Price accessDetails={asset.accessDetails} size="small" /> */}
              {/* <NetworkName networkId={asset.chainId} className={styles.network} /> */}
              {/* TODO: Add file type here mp3/flac */}
              audio
            </footer>
          </a>
        </Link>
        {/* <div className={styles.actionArea}>
          <button className={styles.button}>Buy/Play</button>
        </div> */}
      </div>
    </article>
  )
}
