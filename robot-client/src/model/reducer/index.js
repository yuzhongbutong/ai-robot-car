import {combineReducers} from 'redux';
import AppReducer from './AppReducer';
import CarReducer from './CarReducer';
import HumitureReducer from './HumitureReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
  appReducer: AppReducer,
  carReducer: CarReducer,
  humitureReducer: HumitureReducer,
  chatReducer: ChatReducer
});