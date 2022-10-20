import React, { ReactElement, useState } from 'react'
import Link from 'next/link'
import loadable from '@loadable/component'
import Logo from '@shared/atoms/Logo'
// import UserPreferences from './UserPreferences'
import Networks from './UserPreferences/Networks'
import SearchBar from './SearchBar'
import styles from './Menu.module.css'
import { useRouter } from 'next/router'
import { useMarketMetadata } from '@context/MarketMetadata'
import UserProfile from '../../@images/userProfile.svg'
import PublishIcon from '../../@images/publishIcon.svg'
import { useWeb3 } from '@context/Web3'

const Wallet = loadable(() => import('./Wallet'))

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const router = useRouter()

  const classes =
    router?.pathname === item.link
      ? `${styles.link} ${styles.active}`
      : styles.link

  return (
    <Link key={item.name} href={item.link}>
      <a className={classes}>{item.name}</a>
    </Link>
  )
}

export default function Menu(): ReactElement {
  const { siteContent } = useMarketMetadata()
  let { accountId } = useWeb3()
  accountId = 'sdfsf'
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className={styles.menu}>
      <Link href="/">
        <a className={styles.logo}>
          <Logo noWordmark />
          <h1 className={styles.title}>{siteContent?.siteTitle}</h1>
        </a>
      </Link>

      {/* <ul className={styles.navigation}>
        {siteContent?.menu.map((item: MenuItem) => (
          <li key={item.name}>
            <MenuLink item={item} />
          </li>
        ))}
      </ul> */}

      <div className={styles.actions}>
        {!searchOpen && accountId && (
          <Link
            href={siteContent.menu.find(({ name }) => name === 'Publish').link}
          >
            <a
              href={
                siteContent.menu.find(({ name }) => name === 'Publish').link
              }
              className={styles.publishBtn}
            >
              <PublishIcon />
              <span>Publish</span>
            </a>
          </Link>
        )}
        <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        <Wallet />
        {accountId && (
          <Link
            href={siteContent.menu.find(({ name }) => name === 'Profile').link}
          >
            <a
              href={
                siteContent.menu.find(({ name }) => name === 'Profile').link
              }
              className={styles.profileLink}
            >
              <UserProfile width={20} height={20} />
            </a>
          </Link>
        )}
        <Networks />
        {/* <UserPreferences /> */}
      </div>
    </nav>
  )
}
