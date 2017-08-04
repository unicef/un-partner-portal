import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { Router, browserHistory } from 'react-router'
import { routeChanged } from './reducers/route'
import getTheme from './styles/muiTheme';
import store from './store';
import RouterComponent from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

browserHistory.listen((location) => {
  store.dispatch(routeChanged(location));
});
browserHistory.push(window.location.pathname);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={createMuiTheme(getTheme())}>
          <MuiThemeProviderLegacy>
          <Router routes={RouterComponent} history={browserHistory}>
          </Router>
          </MuiThemeProviderLegacy>
        </MuiThemeProvider>
        
      </Provider>
    )
  }
};

export default App;
