import {connect} from 'react-redux';
import HumitureComponent from './../../component/monitor/HumitureComponent';

function mapStateToProps(state) {
  return {
    humiture: state.humitureReducer.humiture
  };
}

const Humiture = connect(mapStateToProps)(HumitureComponent);

export default Humiture;