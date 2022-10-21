import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  ReactElement
} from 'react'
import SearchIcon from '@images/search.svg'
import CloseIcon from '@images/closeIcon.svg'
import InputElement from '@shared/FormInput/InputElement'
import styles from './SearchBar.module.css'
import { addExistingParamsToUrl } from '../Search/utils'
import { useRouter } from 'next/router'
import cx from 'classnames'

async function emptySearch() {
  const searchParams = new URLSearchParams(window?.location.href)
  const text = searchParams.get('text')

  if (text !== ('' || undefined || null)) {
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    // router.push(`${url}&text=%20`)
  }
}

export default function SearchBar({
  placeholder,
  initialValue,
  searchOpen,
  setSearchOpen
}: {
  placeholder?: string
  initialValue?: string
  searchOpen: boolean
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {
  const router = useRouter()
  const [value, setValue] = useState(initialValue || '')
  const parsed = router.query
  const { text, owner } = parsed

  useEffect(() => {
    ;(text || owner) && setValue((text || owner) as string)
  }, [text, owner])

  async function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (value === '') setValue(' ')

    const urlEncodedValue = encodeURIComponent(value)
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    router.push(`${url}&text=${urlEncodedValue}`)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    e.target.value === '' && emptySearch()
  }

  async function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      await startSearch(e)
    }
  }

  async function handleButtonClick(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    await setSearchOpen(!searchOpen)
    // await startSearch(e)
  }

  return (
    <form className={cx(styles.search, searchOpen && styles.openedSearch)}>
      <InputElement
        type="search"
        name="search"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={handleChange}
        required
        size="small"
        className={styles.input}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleButtonClick} className={styles.button}>
        {searchOpen ? (
          <CloseIcon width={15} height={15} />
        ) : (
          <SearchIcon width={15} height={15} />
        )}
      </button>
    </form>
  )
}
