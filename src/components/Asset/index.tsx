import React, { useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'
import Page from '@shared/Page'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useAsset } from '@context/Asset'
import AssetContent from './AssetContent'
import { v3MarketUri } from 'app.config'

export default function AssetDetails({ uri }: { uri: string }): ReactElement {
  const router = useRouter()
  const { asset, title, error, isInPurgatory, loading, isV3Asset } = useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (isV3Asset) {
      router.push(`${v3MarketUri}${uri}`)
    }
    if (!asset || error) {
      setPageTitle(title || 'Could not retrieve asset')
      return
    }
    setPageTitle(isInPurgatory ? '' : title)
  }, [asset, error, isInPurgatory, isV3Asset, router, title, uri])

  if (asset && pageTitle !== undefined && !loading) {
    return (
      <Page title={pageTitle} uri={uri}>
        <AssetContent asset={asset} />
      </Page>
    )
  }

  if (error && isV3Asset === false) {
    return (
      <Page title={pageTitle} noPageHeader uri={uri}>
        <Alert title={pageTitle} text={error} state={'error'} />
      </Page>
    )
  }

  return (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
