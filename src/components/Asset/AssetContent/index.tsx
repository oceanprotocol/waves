import React, {
  ReactElement,
  useState
  // useEffect
} from 'react'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '@context/UserPreferences'
// import Bookmark from './Bookmark'
import { useAsset } from '@context/Asset'
import Alert from '@shared/atoms/Alert'
import DebugOutput from '@shared/DebugOutput'
// import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import styles from './index.module.css'
import NetworkName from '@shared/NetworkName'
import content from '../../../../content/purgatory.json'
// import Web3 from 'web3'
import Button from '@shared/atoms/Button'
import Time from '@shared/atoms/Time'
import MetaItem from './MetaItem'

export default function AssetContent({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { isInPurgatory, purgatoryData, isOwner, isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [receipts, setReceipts] = useState([])
  // const [nftPublisher, setNftPublisher] = useState<string>()

  // useEffect(() => {
  //   setNftPublisher(
  //     Web3.utils.toChecksumAddress(
  //       receipts?.find((e) => e.type === 'METADATA_CREATED')?.nft?.owner
  //     )
  //   )
  // }, [receipts])

  return (
    <>
      <div className={styles.datasetSection}>
        <div className={styles.featuredImage}>
          <div
            className={styles.assetimage}
            style={{
              backgroundImage: `url(${
                asset.metadata.additionalInformation.coverPicture ??
                '/placeholderImage.jpg'
              })`
            }}
          />
        </div>
        <div className={styles.songMainData}>
          <h1 className={styles.songName}>{asset.metadata.name}</h1>
          <div className={styles.artists}>
            {asset.metadata.additionalInformation.artist}
          </div>
          <div className={styles.songStats}>
            <span>
              Published <Time date={asset?.metadata.created} relative /> <br />
              {asset?.metadata.created !== asset?.metadata.updated && (
                <>
                  {' — '}
                  <span className={styles.updated}>
                    updated <Time date={asset?.metadata.updated} relative />
                  </span>
                </>
              )}
            </span>
            {asset?.stats?.orders > 0 && (
              <span>
                Purchased by {asset.stats.orders} user
                {asset.stats.orders > 1 && 's'}
              </span>
            )}
          </div>
          <div className={styles.songPriceBuy}>
            <AssetActions asset={asset} onAssetPage />
            <NetworkName
              networkId={asset?.chainId}
              className={styles.network}
            />
            {isOwner && isAssetNetwork && (
              <div className={styles.ownerActions}>
                <Button
                  style="text"
                  size="small"
                  to={`/asset/${asset?.id}/edit`}
                >
                  Edit Asset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.datasetSection}>
        <div className={styles.metaWrap}>
          <div className={styles.metaFirstSection}>
            <div className={styles.songDescription}>
              <MetaItem
                title="Description"
                content={
                  isInPurgatory === true ? (
                    <Alert
                      title={content.asset.title}
                      badge={`Reason: ${purgatoryData?.reason}`}
                      text={content.asset.description}
                      state="error"
                    />
                  ) : (
                    <>
                      <Markdown
                        className={styles.description}
                        text={asset?.metadata?.description || ''}
                      />
                      <MetaSecondary ddo={asset} />
                    </>
                  )
                }
              />
            </div>
            <div className={styles.metaDataList}>
              <MetaFull ddo={asset} />
            </div>
          </div>
          <MetaItem title="DID" content={<code>{asset?.id}</code>} />
          <EditHistory receipts={receipts} setReceipts={setReceipts} />
          {debug === true && <DebugOutput title="DDO" output={asset} />}
        </div>
      </div>

      {/* <article className={styles.grid}>
        <div>
          <div className={styles.content}>
            <MetaMain asset={asset} nftPublisher={nftPublisher} />
            {asset?.accessDetails?.datatoken !== null && (
              <Bookmark did={asset?.id} />
            )}
          </div>
        </div>
      </article> */}
    </>
  )
}
