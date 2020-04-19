export const SET_MESSAGES = 'SET_MESSAGES';
export const PUSH_MESSAGE = 'PUSH_MESSAGE';

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  messages
});

export const pushMessage = (message) => ({
  type: PUSH_MESSAGE,
  message
});