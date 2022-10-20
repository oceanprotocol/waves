import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '@shared/AssetList'
import { queryMetadata } from '@utils/aquarius'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'

function sortElements(items: Asset[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.services[0].datatokenAddress.toLowerCase()) -
      sorted.indexOf(b.services[0].datatokenAddress.toLowerCase())
    )
  })
  return items
}

export default function SectionQueryResult({
  title,
  query,
  action,
  queryData,
  trendingList
}: {
  title?: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string[]
  trendingList?: boolean
}) {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!query) return

    async function init() {
      if (chainIds.length === 0) {
        const result: PagedAssets = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          aggregations: undefined
        }
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)
          console.log('query', query)
          const result = await queryMetadata(query, newCancelToken())
          if (!isMounted()) return
          if (queryData && result?.totalResults > 0) {
            const sortedAssets = sortElements(result.results, queryData)
            const overflow = sortedAssets.length - 9
            sortedAssets.splice(sortedAssets.length - overflow, overflow)
            result.results = sortedAssets
          }
          console.log('result', result)
          setResult(result)
          setLoading(false)
        } catch (error) {
          LoggerInstance.error(error.message)
        }
      }
    }
    init()
  }, [chainIds.length, isMounted, newCancelToken, query, queryData])

  return (
    <section className={styles.section}>
      {title && <h3>{title}</h3>}
      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading || !query}
        trendingList={trendingList}
      />

      {!!action && action}
    </section>
  )
}
