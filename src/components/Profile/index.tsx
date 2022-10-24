import React, { ReactElement, useState } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'
import cx from 'classnames'
import styles from './history.module.css'

export default function AccountPage({
  accountId
}: {
  accountId: string
}): ReactElement {
  const [activeTab, setActiveTab] = useState<'uploads' | 'owned'>('uploads')

  const handleTabChange = (tabname: 'uploads' | 'owned') => {
    setActiveTab(tabname)
  }
  return (
    <>
      <AccountHeader accountId={accountId} />
      <div className={styles.tabsButtons}>
        <button
          className={cx(
            activeTab === 'uploads' && accountId ? styles.active : ''
          )}
          onClick={() => handleTabChange('uploads')}
        >
          Uploads
        </button>
        {accountId && (
          <button
            className={cx(activeTab === 'owned' ? styles.active : '')}
            onClick={() => handleTabChange('owned')}
            disabled
          >
            Owned
          </button>
        )}
      </div>
      {activeTab === 'uploads' ? (
        <HistoryPage accountIdentifier={accountId} />
      ) : (
        activeTab === 'owned' && (
          // TODO: show owned songs list
          <></>
        )
      )}
    </>
  )
}
