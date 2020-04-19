import {connect} from 'react-redux';
import {setSocket, setHumiture} from './../../model/action';
import AppComponent from './../component/AppComponent';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    setSocket: (socket) => dispatch(setSocket(socket)),
    setHumiture: (humiture) => dispatch(setHumiture(humiture))
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;