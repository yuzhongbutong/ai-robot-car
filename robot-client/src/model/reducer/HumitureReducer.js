import {SET_HUMITURE} from './../action';

const HumitureReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_HUMITURE:
      const {humiture} = action;
      return {
        humiture: humiture
      };
    default:
      return state;
  }
};

export default HumitureReducer;