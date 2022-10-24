import { useRouter } from 'next/router'
import React from 'react'
import styles from './GoBack.module.css'
import ArrowBack from '@images/arrowBack.svg'

const GoBack = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }
  return (
    <div className={styles.root}>
      <button onClick={handleGoBack} className={styles.button}>
        <ArrowBack /> <span>Back</span>
      </button>
    </div>
  )
}

export default GoBack
