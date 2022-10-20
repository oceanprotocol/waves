import React, { ReactElement, ChangeEvent } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import Input from '@shared/FormInput'
import { useMarketMetadata } from '@context/MarketMetadata'
import styles from './Currency.module.css'

export default function Currency(): ReactElement {
  const { currency, setCurrency } = useUserPreferences()
  const { appConfig } = useMarketMetadata()

  return (
    <li className={styles.inputWrapper}>
      <Input
        name="currency"
        label="Currency"
        help="Your conversion display currency."
        type="select"
        options={appConfig?.currencies}
        value={currency}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(e.target.value)
        }
        size="small"
      />
    </li>
  )
}
