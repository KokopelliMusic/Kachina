export type Playlist = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  creator: User | string
  songs: Song[] | null
}

export type PlaylistWithSongs = Playlist & {
  songs: Song[]
  creator: User
}

export type SongType = 'spotify' | 'youtube' | 'soundcloud' | 'mp3'

export type Song = {
  id: number
  title: string
  artists: string
  album: string
  length: number
  cover: string
  added_by: User
  song_type: string
}

export type User = {
  id: number
  username: string
  profile_picture: string
}