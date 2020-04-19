import {SET_SOCKET} from './../action';

const AppReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SOCKET:
      const {socket} = action;
      return {
        socket
      };
    default:
      return state;
  }
};

export default AppReducer;