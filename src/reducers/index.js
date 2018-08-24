import { combineReducers } from 'redux';
import GenreReducer from './GenreReducer';
import SongReducer from './SongReducer';
import SelectedReducer from './SelectedReducer';
import UserReducer from './UserReducer';
import TokenReducer from './TokenReducer';
import ExpirationReducer from './ExpirationReducer';
import DeviceReducer from './DeviceReducer';


export default combineReducers({
  user: UserReducer,
  deviceID: DeviceReducer,
  accessToken: TokenReducer,
  expireTime: ExpirationReducer,
  allGenres: GenreReducer,
  selectedGenres: SelectedReducer,
  songs: SongReducer,
});
