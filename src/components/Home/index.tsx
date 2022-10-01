import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
// import Bookmarks from './Bookmarks'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
// import styles from './index.module.css'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
// import PublishersWithMostSales from './PublishersWithMostSales'
import SectionQueryResult from './SectionQueryResult'

export default function HomePage(): ReactElement {
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  // const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 9
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(generateBaseQuery(baseParams))

    // const baseParamsSales = {
    //   chainIds,
    //   esPaginationOptions: {
    //     size: 9
    //   },
    //   sortOptions: {
    //     sortBy: SortTermOptions.Stats
    //   } as SortOptions
    // } as BaseQueryParams
    // setQueryMostSales(generateBaseQuery(baseParamsSales))
  }, [chainIds])

  useEffect(() => {
    console.log('queryLatest', queryLatest)
  }, [queryLatest])

  return (
    <>
      {/* <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section> */}

      {/* <SectionQueryResult title="Most Sales" query={queryMostSales} /> */}

      <SectionQueryResult
        title="Recently Published"
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
