import React, { ReactElement } from 'react'
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

export default function Networks(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { networksList } = useNetworkMetadata()

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

  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Currency />
          </li>
          <li>
            <Label htmlFor="chains">Networks</Label>
            <FormHelp>Switch the data source for the interface.</FormHelp>

            <NetworksList title="Main" networks={networksMain} />
            <NetworksList title="Test" networks={networksTest} />
          </li>
        </ul>
      }
      trigger="click focus"
      className={styles.networks}
    >
      <>
        <GlobeSettings width={28} height={22} />
        <span>Currency & network settings</span>
      </>
    </Tooltip>
  )
}
