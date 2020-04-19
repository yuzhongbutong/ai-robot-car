import {connect} from 'react-redux';
import ChatInteractiveComponent from './../../component/chat/ChatInteractiveComponent';
import {setDirection, pushMessage} from './../../../model/action';

function mapStateToProps(state) {
  return {
    socket: state.appReducer.socket,
    messages: state.chatReducer.messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDirection: (direction) => dispatch(setDirection(direction)),
    pushMessage: (message) => dispatch(pushMessage(message))
  };
}

const ChatInteractive = connect(mapStateToProps, mapDispatchToProps)(ChatInteractiveComponent);

export default ChatInteractive;