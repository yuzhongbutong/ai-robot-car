import {SET_MESSAGES, PUSH_MESSAGE} from './../action';

const ChatReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      const {messages} = action;
      return {
        messages
      };
    case PUSH_MESSAGE:
      const {message} = action;
      return {
        messages: [
          ...state.messages,
          message
        ]
      };
    default:
      return state;
  }
};

export default ChatReducer;