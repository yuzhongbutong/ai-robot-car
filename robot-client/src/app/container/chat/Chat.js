import {connect} from 'react-redux';
import ChatComponent from './../../component/chat/ChatComponent';
import {setMessages} from './../../../model/action';

function mapStateToProps(state) {
  return {
    messages: state.chatReducer.messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMessages: (messages) => dispatch(setMessages(messages))
  };
}

const Chat = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);

export default Chat;