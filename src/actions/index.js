export const selectGenre = genres => ({
  type: 'select_genre',
  payload: genres,
});

export const addSongs = songs => ({
  type: 'add_songs',
  payload: songs,
});

export const setGenres = allGenres => ({
  type: 'add_genres',
  payload: allGenres,
});

export const setAccessToken = accessToken => ({
  type: 'set_access_token',
  payload: accessToken,
});

export const setExpireTime = expireTime => ({
  type: 'set_expire_time',
  payload: expireTime,
});

export const setUser = user => ({
  type: 'set_user',
  payload: user,
});

export const setDeviceID = deviceID => ({
  type: 'set_device_id',
  payload: deviceID,
});
