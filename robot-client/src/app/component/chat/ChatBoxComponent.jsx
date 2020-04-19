import React, {Component} from 'react';
import avatar_robot from './../../assets/image/avatar_robot.png';
import avatar_custom from './../../assets/image/avatar_custom.jpg';
import Constant from './../../common/Constant';

class ChatBoxComponent extends Component {

  componentDidUpdate() {
    const messageBox = document.querySelector('.chat-message-root');
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  render() {
    const {messages} = this.props;
    return (
      <ul className="chat-box-root">
        {messages.map((item, index) => (
          <li key={index}>
            <p className="chat-box-time">
              <span>{item.time}</span>
            </p>
            <div className={`chat-box-original ${item.from === Constant.MSG_FROM_CUSTOM ? 'chat-box-custom' : ''}`}>
              <img width="30" height="30" alt={item.from} src={item.from === Constant.MSG_FROM_CUSTOM ? avatar_custom : avatar_robot}/>
              <div>{item.text}</div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}

export default ChatBoxComponent;