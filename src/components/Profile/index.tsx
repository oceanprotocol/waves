import React, { ReactElement, useMemo, useState } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'
import cx from 'classnames'
import styles from './history.module.css'
import OwnedAssetList from '@shared/OwnedAssetList/OwnedAssetList'

export default function AccountPage({
  accountId,
  myProfileId
}: {
  accountId: string
  myProfileId: string
}): ReactElement {
  const [activeTab, setActiveTab] = useState<'uploads' | 'owned'>('uploads')

  const handleTabChange = (tabname: 'uploads' | 'owned') => {
    setActiveTab(tabname)
  }

  const showOwned = useMemo(() => {
    if (myProfileId && myProfileId === accountId) return true
    return false
  }, [accountId, myProfileId])

  console.log(myProfileId)

  return (
    <>
      <AccountHeader accountId={accountId} />
      <div className={styles.tabsButtons}>
        <button
          className={cx(
            activeTab === 'uploads' && showOwned && accountId
              ? styles.active
              : ''
          )}
          onClick={() => handleTabChange('uploads')}
        >
          Uploads
        </button>
        {showOwned && (
          <button
            className={cx(activeTab === 'owned' ? styles.active : '')}
            onClick={() => handleTabChange('owned')}
          >
            Owned
          </button>
        )}
      </div>
      {activeTab === 'uploads' ? (
        <HistoryPage accountIdentifier={accountId} />
      ) : (
        showOwned &&
        activeTab === 'owned' && (
          <>
            <OwnedAssetList />
          </>
        )
      )}
    </>
  )
}
