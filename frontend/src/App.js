import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { routeChanged } from './reducers/route';
import getTheme from './styles/muiTheme';
import store from './store';
import RouterComponent from './routes';


injectTapEventPlugin();

browserHistory.listen((location) => {
  store.dispatch(routeChanged(location));
});

browserHistory.push(window.location.pathname);

// has to be React class otherwise react-scripts throw error
// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={createMuiTheme(getTheme())}>
          <MuiThemeProviderLegacy>
            <Router routes={RouterComponent} history={browserHistory} />
          </MuiThemeProviderLegacy>
        </MuiThemeProvider>

      </Provider>
    );
  }
}

export default App;
