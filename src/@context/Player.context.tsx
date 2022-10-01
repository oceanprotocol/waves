import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

type UsePlayerType = {
  song: string
  play: (url: string) => void
  loading: boolean
  close: () => void
}

export const PlayerContext = createContext({} as UsePlayerType)

type Props = {
  children: ReactNode
}

export const PlayerProvider: React.FC<Props> = ({ children }) => {
  const [assetUrl, setAssetUrl] = useState('')
  const [song, setSong] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!assetUrl) {
      setSong('')
      return
    }
    setSong('')
    setLoading(true)
    fetch(assetUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const songBlob = URL.createObjectURL(blob)
        setSong(songBlob)
        setLoading(false)
      })
  }, [assetUrl])

  const play = (url: string) => {
    setAssetUrl(url)
  }

  const close = () => {
    setSong('')
    setAssetUrl('')
  }

  return (
    <PlayerContext.Provider value={{ song, play, loading, close }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayerContext = (): UsePlayerType => {
  return useContext(PlayerContext)
}
