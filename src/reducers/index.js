import { combineReducers } from 'redux';
import GenreReducer from './GenreReducer';
import SongReducer from './SongReducer';
import SelectedReducer from './SelectedReducer';
import UserReducer from './UserReducer';


export default combineReducers({
  user: UserReducer,
  allGenres: GenreReducer,
  selectedGenres: SelectedReducer,
  songs: SongReducer
});