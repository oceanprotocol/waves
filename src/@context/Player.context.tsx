import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

type SongDataType = {
  artist: string
  album: string
  coverPicture: string
  genre: string
  title: string
}

type UsePlayerType = {
  song: string
  play: (url: string, songData: SongDataType, blob?: boolean) => void
  loading: boolean
  close: () => void
  songData: SongDataType
}

export const PlayerContext = createContext({} as UsePlayerType)

type Props = {
  children: ReactNode
}

export const PlayerProvider: React.FC<Props> = ({ children }) => {
  const [assetUrl, setAssetUrl] = useState('')
  const [song, setSong] = useState('')
  const [songData, setSongData] = useState<SongDataType>()
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

  const play = (
    url: string,
    data: SongDataType & { [key: string]: string },
    isBlob?: boolean
  ) => {
    setSongData(data)
    if (isBlob) {
      setSong(url)
      return
    }
    setAssetUrl(url)
  }

  const close = () => {
    setSong('')
    setAssetUrl('')
    setSongData(undefined)
  }

  return (
    <PlayerContext.Provider value={{ song, play, loading, close, songData }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayerContext = (): UsePlayerType => {
  return useContext(PlayerContext)
}
