import {createStore} from 'redux';
import reducer from './../reducer';

const initValue = {
  chatReducer: {
    messages: []
  }
};

const store = createStore(reducer, initValue);

export default store;