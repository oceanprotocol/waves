import React, { ReactElement } from 'react'
import Link from 'next/link'
import styles from './index.module.css'
import cx from 'classnames'

export interface TagsProps {
  items: string[]
  max?: number
  showMore?: boolean
  className?: string
  small?: boolean
  noLinks?: boolean
}

const Tag = ({
  tag,
  noLinks,
  small
}: {
  tag: string
  noLinks?: boolean
  small?: boolean
}) => {
  const urlEncodedTag = encodeURIComponent(tag)
  return noLinks ? (
    <span className={styles.tag}>{tag}</span>
  ) : (
    <Link href={`/search?tags=${urlEncodedTag}&sort=_score&sortOrder=desc`}>
      <a className={cx(styles.tag, small && styles.smallTag)} title={tag}>
        {tag}
      </a>
    </Link>
  )
}

export default function Tags({
  items,
  max,
  showMore,
  className,
  small,
  noLinks
}: TagsProps): ReactElement {
  max = max || items.length
  const remainder = items.length - max
  // filter out empty array items, and restrict to `max`
  const tags = items.filter((tag) => tag !== '').slice(0, max)
  const shouldShowMore = showMore && remainder > 0
  const classes = className ? `${styles.tags} ${className}` : styles.tags

  return (
    <div className={classes}>
      {tags?.map((tag, i) => (
        <Tag tag={tag} noLinks={noLinks} key={tag + i} small={small} />
      ))}
      {shouldShowMore && (
        <span className={styles.more}>{`+ ${items.length - max} more`}</span>
      )}
    </div>
  )
}
