import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
// import Bookmarks from './Bookmarks'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
// import styles from './index.module.css'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
// import PublishersWithMostSales from './PublishersWithMostSales'
import SectionQueryResult from './SectionQueryResult'
import styles from './index.module.css'
import Link from 'next/link'
import { useWeb3 } from '@context/Web3'

export default function HomePage(): ReactElement {
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const { chainIds } = useUserPreferences()
  const { accountId } = useWeb3()

  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 10
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(generateBaseQuery(baseParams))

    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 4
      },
      sortOptions: {
        sortBy: SortTermOptions.Stats
      } as SortOptions
    } as BaseQueryParams
    setQueryMostSales(generateBaseQuery(baseParamsSales))
  }, [chainIds, accountId])

  useEffect(() => {
    console.log('queryLatest', queryLatest)
  }, [queryLatest])

  return (
    <>
      {/* <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section> */}
      <div className={styles.trendingtitleBar}>
        <div className={styles.trendingTitle}>Trending</div>
        <Link href="/search?sort=stats.orders&sortOrder=desc">
          <a
            href="/search?sort=stats.orders&sortOrder=desc"
            className={styles.trendingShowMore}
          >
            Show more
          </a>
        </Link>
      </div>
      <div className={styles.trendingWrap}>
        <SectionQueryResult query={queryMostSales} trendingList />
      </div>
      <div className={styles.tabsButtons}>
        <button>Recently</button>
      </div>
      <SectionQueryResult
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=nft.created&sortOrder=desc">
            All audio files →
          </Button>
        }
      />
      {/* <PublishersWithMostSales title="Publishers With Most Sales" /> */}
    </>
  )
}
