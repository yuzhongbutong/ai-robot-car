import {connect} from 'react-redux';
import ChatBoxComponent from './../../component/chat/ChatBoxComponent';

function mapStateToProps(state) {
  return {
    messages: state.chatReducer.messages
  };
}

const ChatBox = connect(mapStateToProps)(ChatBoxComponent);

export default ChatBox;