import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import cx from 'classnames'
import styles from './index.module.css'
import InputRadio from '@shared/FormInput/InputRadio'
// import InputRadio from '@shared/FormInput/InputRadio'

export interface TabsItem {
  title: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
  defaultIndex?: number
  showRadio?: boolean
  noPadding?: boolean
  noTabs?: boolean
}

export default function Tabs({
  items,
  className,
  handleTabChange,
  defaultIndex,
  noPadding,
  showRadio,
  noTabs
}: TabsProps): ReactElement {
  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
      {!noTabs && (
        <div className={styles.tabListContainer}>
          <TabList className={styles.tabList}>
            {items.map((item, index) => (
              <Tab
                className={styles.tab}
                key={index}
                onClick={
                  handleTabChange ? () => handleTabChange(item.title) : null
                }
                disabled={item.disabled}
              >
                {showRadio ? (
                  <InputRadio
                    name={item.title}
                    type="radio"
                    checked={index === defaultIndex}
                    options={[item.title]}
                    readOnly
                  />
                ) : (
                  item.title
                )}
              </Tab>
            ))}
          </TabList>
        </div>
      )}
      <div className={cx(styles.tabContent, noPadding && styles.noPadding)}>
        {items.map((item, index) => (
          <TabPanel key={index}>{item.content}</TabPanel>
        ))}
      </div>
    </ReactTabs>
  )
}
