import React, { ReactElement } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import Conversion from './Conversion'
import styles from './PriceUnit.module.css'
import { useUserPreferences } from '@context/UserPreferences'
// import Badge from '@shared/atoms/Badge'
import cx from 'classnames'

export function formatPrice(price: string, locale: string): string {
  return formatCurrency(Number(price), '', locale, false, {
    // Not exactly clear what `significant figures` are for this library,
    // but setting this seems to give us the formatting we want.
    // See https://github.com/oceanprotocol/market/issues/70
    significantFigures: 4
  })
}

export default function PriceUnit({
  price,
  className,
  size = 'small',
  conversion,
  symbol,
  type,
  onAssetPage
}: {
  price: string
  type?: string
  className?: string
  size?: 'small' | 'mini' | 'large'
  conversion?: boolean
  symbol?: string
  onAssetPage?: boolean
}): ReactElement {
  const { locale } = useUserPreferences()

  return (
    <div className={`${styles.price} ${styles[size]} ${className}`}>
      {type === 'free' ? (
        <div>Free</div>
      ) : (
        <>
          <div className={cx(onAssetPage && styles.mainPrice)}>
            {Number.isNaN(Number(price)) ? '-' : formatPrice(price, locale)}{' '}
            <span className={styles.symbol}>{symbol}</span>
          </div>
          {conversion && <Conversion price={price} symbol={symbol} />}
        </>
      )}
    </div>
  )
}
