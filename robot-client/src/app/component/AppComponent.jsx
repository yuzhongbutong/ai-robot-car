import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRobot} from '@fortawesome/free-solid-svg-icons';
import {faChartBar} from '@fortawesome/free-solid-svg-icons';
import {faGamepad} from '@fortawesome/free-solid-svg-icons';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Constant from './../common/Constant';
import Humiture from './../container/monitor/Humiture';
import Car from './../container/control/Car';
import Chat from './../container/chat/Chat';

class AppComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: Constant.INDEX_TAB_0
    };

    const {setSocket, setHumiture} = this.props;
    const socket = require('socket.io-client')(':8990');
    socket.on('ht', (data) => {
      const humiture = JSON.parse(data);
      setHumiture(humiture);
    });
    setSocket(socket);
  }

  setTab(index) {
    this.setState({
      tabIndex: index
    });
  }

  render() {
    let tab;
    if (this.state.tabIndex === Constant.INDEX_TAB_0) {
      tab = <Humiture/>;
    } else if (this.state.tabIndex === Constant.INDEX_TAB_1) {
      tab = <Car/>;
    } else if (this.state.tabIndex === Constant.INDEX_TAB_2) {
      tab = <Chat/>;
    }

    return (
      <div>
        <nav className="navbar navbar-fixed-top app-navbar-blue">
          <div className="container app-container">
            <FontAwesomeIcon icon={faRobot} size="3x"/>
            <span className="app-container-title">Intelligent Robot</span>
          </div>
        </nav>
        <div className="app-content">
          {tab}
        </div>
        <nav className="navbar navbar-fixed-bottom app-navbar-white">
          <ul className="nav nav-tabs app-nav-tabs row-no-gutters">
            <li className={`col-xs-4 ${this.state.tabIndex === Constant.INDEX_TAB_0 ? 'active' : null}`}>
              <span onClick={() => this.setTab(Constant.INDEX_TAB_0)}>
                <FontAwesomeIcon icon={faChartBar}/>
                <span>Monitor</span>
              </span>
            </li>
            <li className={`col-xs-4 ${this.state.tabIndex === Constant.INDEX_TAB_1 ? 'active' : null}`}>
              <span onClick={() => this.setTab(Constant.INDEX_TAB_1)}>
                <FontAwesomeIcon icon={faGamepad}/>
                <span>Control</span>
              </span>
            </li>
            <li className={`col-xs-4 ${this.state.tabIndex === Constant.INDEX_TAB_2 ? 'active' : null}`}>
              <span onClick={() => this.setTab(Constant.INDEX_TAB_2)}>
                <FontAwesomeIcon icon={faComment}/>
                <span>Chat</span>
              </span>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default AppComponent;
