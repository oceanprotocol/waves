import React, { ReactElement, useState } from 'react'
import Label from '@shared/FormInput/Label'
import FormHelp from '@shared/FormInput/Help'
import Tooltip from '@shared/atoms/Tooltip'
import NetworksList from './NetworksList'
import stylesIndex from '../index.module.css'
import styles from './index.module.css'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import { useMarketMetadata } from '@context/MarketMetadata'
import Currency from '../Currency'
import GlobeSettings from '../../../../@images/globeSettings.svg'
import useWindowDimensions from '@hooks/useWindowDimensions'
import ChevronDown from '@images/chevronDown.svg'
import cx from 'classnames'

export default function Networks(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { networksList } = useNetworkMetadata()
  const { width } = useWindowDimensions()
  const [viewNetworks, setViewNetworks] = useState<boolean>(false)

  const networksMain = filterNetworksByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  )

  const networksTest = filterNetworksByType(
    'testnet',
    appConfig.chainIdsSupported,
    networksList
  )
  const handleViewNetworks = () => {
    setViewNetworks(!viewNetworks)
  }

  const NetworkCurrencySettings: ReactElement = (
    <ul className={stylesIndex.preferencesDetails}>
      <Currency />
      <li>
        <Label htmlFor="chains">Networks</Label>
        <FormHelp>Switch the data source for the interface.</FormHelp>

        <NetworksList title="Main" networks={networksMain} />
        <NetworksList title="Test" networks={networksTest} />
      </li>
    </ul>
  )

  if (width > 600)
    return (
      <Tooltip
        content={NetworkCurrencySettings}
        trigger="click focus"
        className={styles.networks}
      >
        <>
          <GlobeSettings width={28} height={22} />
          <span>Currency & network settings</span>
        </>
      </Tooltip>
    )

  return (
    <>
      <div
        className={styles.openCurrencyNetwork}
        onClick={handleViewNetworks}
        aria-hidden
      >
        <GlobeSettings width={28} height={22} />
        <span>Currency & network settings</span>
        <ChevronDown
          aria-hidden="true"
          width={12}
          height={12}
          className={cx(styles.caret, viewNetworks && styles.openCaret)}
        />
      </div>
      {viewNetworks && (
        <div className={styles.currencyNetWrap}>{NetworkCurrencySettings}</div>
      )}
    </>
  )
}
