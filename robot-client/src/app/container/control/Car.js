import {connect} from 'react-redux';
import CarComponent from './../../component/control/CarComponent';
import {setDirection} from './../../../model/action';

function mapStateToProps(state) {
  return {
    socket: state.appReducer.socket,
    direction: state.carReducer.direction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDirection: (direction) => dispatch(setDirection(direction))
  };
}

const Car = connect(mapStateToProps, mapDispatchToProps)(CarComponent);

export default Car;