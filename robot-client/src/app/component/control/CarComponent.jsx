import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';
import {faCar} from '@fortawesome/free-solid-svg-icons';
import {faHandPointUp} from '@fortawesome/free-solid-svg-icons';
import {faHandPointRight} from '@fortawesome/free-solid-svg-icons';
import {faHandPointDown} from '@fortawesome/free-solid-svg-icons';
import {faHandPointLeft} from '@fortawesome/free-solid-svg-icons';
import Constant from './../../common/Constant';

class CarComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
    this.commandKeys = Object.keys(Constant.CAR_COMMAND);
  }

  componentDidMount() {
    this.handleResize();
    window.onresize = this.handleResize.bind(this);
  }

  handleResize() {
    const remoteControl = document.getElementById('remoteControl');
    if (remoteControl) {
      this.setState({
        height: remoteControl.clientWidth
      });
    }
  }

  moveCar = (direction) => {
    const {socket, setDirection} = this.props;
    setDirection(direction);
    const message = {
      car: {
        direction: direction
      }
    };
    socket.emit('car', JSON.stringify(message));
  }

  render() {
    const {direction} = this.props;
    return (
      <div>
        <div className="menu-icon-parent">
          <div className="row-no-gutters text-center">
            <FontAwesomeIcon className={direction !== this.commandKeys[0] ? 'invisible' : ''} icon={faHandPointUp} size="2x"/>
          </div>
          <div className="row-no-gutters text-center menu-icon-middle">
            <FontAwesomeIcon className={direction !== this.commandKeys[3] ? 'invisible' : ''} icon={faHandPointLeft} size="2x"/>
            <div className="menu-icon-car">
              <FontAwesomeIcon icon={faCar} size="4x"/>
            </div>
            <FontAwesomeIcon className={direction !== this.commandKeys[1] ? 'invisible' : ''} icon={faHandPointRight} size="2x"/>
          </div>
          <div className="row-no-gutters text-center">
            <FontAwesomeIcon className={direction !== this.commandKeys[2] ? 'invisible' : ''} icon={faHandPointDown} size="2x"/>
          </div>
        </div>
        <div id="remoteControl" className="menu-parent" style={{height: this.state.height}}>
          <div className="menu-container">
            <div className="menu-wrapper">
              <ul>
                <li>
                  <span onClick={() => this.moveCar(this.commandKeys[0])}>
                    <span>
                      <FontAwesomeIcon icon={faCaretUp} size="5x"/>
                    </span>
                  </span>
                </li>
                <li>
                  <span onClick={() => this.moveCar(this.commandKeys[1])}>
                    <span>
                      <FontAwesomeIcon icon={faCaretUp} size="5x"/>
                    </span>
                  </span>
                </li>
                <li>
                  <span onClick={() => this.moveCar(this.commandKeys[2])}>
                    <span>
                      <FontAwesomeIcon icon={faCaretUp} size="5x"/>
                    </span>
                  </span>
                </li>
                <li>
                  <span onClick={() => this.moveCar(this.commandKeys[3])}>
                    <span>
                      <FontAwesomeIcon icon={faCaretUp} size="5x"/>
                    </span>
                  </span>
                </li>
              </ul>
            </div>
            <ul>
              <li>
                <span onClick={() => this.moveCar(this.commandKeys[4])}>
                  <FontAwesomeIcon icon={faStop} size="3x"/>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default CarComponent;