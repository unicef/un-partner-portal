import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Router, browserHistory } from 'react-router'
import { routeChanged } from './reducers/route'
import getTheme from './styles/muiTheme';
import store from './store';
import RouterComponent from './routes';

browserHistory.listen((location) => {
  store.dispatch(routeChanged(location));
});
browserHistory.push(window.location.pathname);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={createMuiTheme(getTheme())}>
          <Router routes={RouterComponent} history={browserHistory}>
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
};

export default App;
