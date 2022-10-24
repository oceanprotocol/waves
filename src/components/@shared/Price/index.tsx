import React, { ReactElement } from 'react'
import PriceUnit from './PriceUnit'

export default function Price({
  accessDetails,
  orderPriceAndFees,
  className,
  size,
  conversion,
  onAssetPage
}: {
  accessDetails: AccessDetails
  orderPriceAndFees?: OrderPriceAndFees
  className?: string
  conversion?: boolean
  size?: 'small' | 'mini' | 'large'
  onAssetPage?: boolean
}): ReactElement {
  const isSupported =
    accessDetails?.type === 'fixed' || accessDetails?.type === 'free'

  return isSupported ? (
    <PriceUnit
      price={`${orderPriceAndFees?.price || accessDetails?.price}`}
      symbol={accessDetails.baseToken?.symbol}
      className={className}
      size={size}
      conversion={conversion}
      type={accessDetails.type}
      onAssetPage={onAssetPage}
    />
  ) : null
}
