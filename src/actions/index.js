export const selectGenre = (genres) => {
  return {
    type: 'select_genre',
    payload: genres
  }
}

export const addSongs = (songs) => {
  return {
    type: 'add_songs',
    payload: songs
  }
}

export const addGenres = (allGenres) => {
  return {
    type: 'add_genres',
    payload: allGenres
  }
}