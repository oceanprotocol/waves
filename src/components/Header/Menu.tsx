import React, { ReactElement, useCallback, useState } from 'react'
import Link from 'next/link'
import loadable from '@loadable/component'
import Logo from '@shared/atoms/Logo'
// import UserPreferences from './UserPreferences'
import Networks from './UserPreferences/Networks'
import SearchBar from './SearchBar'
import styles from './Menu.module.css'
// import { useRouter } from 'next/router'
import { useMarketMetadata } from '@context/MarketMetadata'
import UserProfile from '../../@images/userProfile.svg'
import PublishIcon from '../../@images/publishIcon.svg'
import { useWeb3 } from '@context/Web3'
import useWindowDimensions from '@hooks/useWindowDimensions'
import cx from 'classnames'

const Wallet = loadable(() => import('./Wallet'))

// declare type MenuItem = {
//   name: string
//   link: string
// }

// function MenuLink({ item }: { item: MenuItem }) {
//   const router = useRouter()

//   const classes =
//     router?.pathname === item.link
//       ? `${styles.link} ${styles.active}`
//       : styles.link

//   return (
//     <Link key={item.name} href={item.link}>
//       <a className={classes}>{item.name}</a>
//     </Link>
//   )
// }

export default function Menu(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { accountId } = useWeb3()
  const [searchOpen, setSearchOpen] = useState(false)
  const { width } = useWindowDimensions()
  const [openedMenu, setOpenedMenu] = useState<boolean>(false)

  const handleOpenMenu = () => {
    setOpenedMenu(!openedMenu)
  }

  const logoVisibility = useCallback(() => {
    if ((!searchOpen && width <= 800) || width > 800) return true
    return false
  }, [searchOpen, width])

  return (
    <>
      {openedMenu && width <= 600 && (
        <>
          <style>
            {`
              body {
                overflow: hidden;
              }
            `}
          </style>
        </>
      )}
      <div
        className={cx(
          styles.headerMenuWrapper,
          openedMenu && width <= 600 && styles.activeMenu
        )}
      >
        <nav className={styles.menu}>
          <Link href="/">
            <a
              className={cx(
                styles.logo,
                !logoVisibility() && styles.hiddenLogo
              )}
            >
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
            {width > 600 && !searchOpen && accountId && (
              <Link
                href={
                  siteContent.menu.find(({ name }) => name === 'Publish').link
                }
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
            {!openedMenu && (
              <SearchBar
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
              />
            )}
            {width > 600 && <Wallet />}
            {width > 600 && accountId && (
              <Link
                href={
                  siteContent.menu.find(({ name }) => name === 'Profile').link
                }
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
            {width > 600 && <Networks />}
            {/* <UserPreferences /> */}
            {width <= 600 && (
              <div
                className={cx(
                  styles.hamburgerMenu,
                  openedMenu && styles.activeMenu
                )}
                onClick={handleOpenMenu}
              >
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        </nav>
        {openedMenu && width <= 600 && (
          <div className={styles.mobileMenuInner}>
            {accountId && (
              <Link
                href={
                  siteContent.menu.find(({ name }) => name === 'Profile').link
                }
              >
                <a
                  href={
                    siteContent.menu.find(({ name }) => name === 'Profile').link
                  }
                  className={styles.profileLink}
                >
                  <UserProfile width={20} height={20} /> <span>My Profile</span>
                </a>
              </Link>
            )}
            <Wallet />
            <Networks />
            {!searchOpen && accountId && (
              <Link
                href={
                  siteContent.menu.find(({ name }) => name === 'Publish').link
                }
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
          </div>
        )}
      </div>
    </>
  )
}
