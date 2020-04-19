import {SET_DIRECTION} from './../action';

const CarReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_DIRECTION:
      const {direction} = action;
      return {
        direction
      };
    default:
      return state;
  }
};

export default CarReducer;