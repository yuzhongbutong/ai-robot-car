import React, {Component} from 'react';
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons';
import avatar_robot from './../../assets/image/avatar_robot.png';
import avatar_custom from './../../assets/image/avatar_custom.jpg';
import Constant from './../../common/Constant';

import ChatBox from './../../container/chat/ChatBox';
import ChatInteractive from './../../container/chat/ChatInteractive';

class ChatComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalShow: false
    };
  }

  componentDidUpdate() {
    const inputBox = document.getElementById('draftMessageID');
    if (inputBox) {
      inputBox.focus();
    }
  }

  refresh() {
    this.setState({
      isModalShow: true
    });
  }

  handleClose() {
    this.setState({
      isModalShow: false
    });
  }

  handleRefresh() {
    const {messages, setMessages} = this.props;
    const initMessage = messages[0];
    initMessage.time = new Date().format(Constant.MSG_TIME_FORMAT);
    setMessages([initMessage]);
    this.handleClose();
  }

  render() {
    const {isModalShow} = this.state;
    return (
      <div className="chat-root">
        <div className="row-no-gutters chat-box">
          <div className="col-sm-3 chat-card-root">
            <div className="chat-card-container">
              <div>
                <img className="chat-card-avatar" width="40" height="40" alt="Robot" src={avatar_robot}/>
                <span className="chat-card-name">Robot</span>
              </div>
              <div>
                <img className="chat-card-avatar" width="40" height="40" alt="You" src={avatar_custom}/>
                <span className="chat-card-name">You</span>
              </div>
              <button className="btn btn-info chat-card-refresh" onClick={() => this.refresh()}>
                <FontAwesomeIcon icon={faSyncAlt}/>
                <span> Refresh</span>
              </button>
            </div>
          </div>
          <div className="col-sm-9 chat-right-panel">
            <div className="chat-message-root">
              <ChatBox/>
            </div>
            <ChatInteractive/>
          </div>
        </div>
        <Modal show={isModalShow} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FontAwesomeIcon icon={faSyncAlt} size="3x"/> Are you sure you want to refresh it?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              No
            </Button>
            <Button variant="primary" bsClass="btn btn-info" onClick={() => this.handleRefresh()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ChatComponent;