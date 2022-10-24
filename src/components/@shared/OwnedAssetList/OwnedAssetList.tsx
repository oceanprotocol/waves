import { useProfile } from '@context/Profile'
import AssetList from '@shared/AssetList'
import React, { useEffect, useState } from 'react'

const OwnedAssetList = () => {
  const { downloads, isDownloadsLoading } = useProfile()

  const [ownedSongs, setOwnedSongs] = useState([])
  const [pageOwned, setPageOwned] = useState<number>(1)
  const [totalOwnedPages, setTotalOwnedPages] = useState<number>(1)
  const [filteredOwnedSongs, setFilteredOwnedSongs] =
    useState<AssetExtended[]>()

  useEffect(() => {
    const assets: AssetExtended[] = []
    if (downloads) {
      downloads.forEach((element: DownloadedAsset) => {
        assets.push(element.asset)
      })
      setOwnedSongs(assets)
      if (assets.length > 10) setTotalOwnedPages(Math.ceil(assets.length / 10))
    }
  }, [downloads])

  useEffect(() => {
    const ownedSongsHelper = ownedSongs.filter(
      (_, index) => index >= pageOwned * 10 - 10 && index < pageOwned * 10
    )
    setFilteredOwnedSongs(ownedSongsHelper)
  }, [ownedSongs, pageOwned])

  return (
    <AssetList
      assets={filteredOwnedSongs}
      isLoading={isDownloadsLoading}
      showPagination
      page={pageOwned}
      totalPages={totalOwnedPages}
      onPageChange={(newPage) => {
        setPageOwned(newPage)
      }}
      noPublisher
    />
  )
}

export default OwnedAssetList
