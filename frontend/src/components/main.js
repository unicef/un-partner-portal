import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';

import { initSession } from '../reducers/session';
import getTheme, { muiOldTheme } from '../styles/muiTheme';


class Main extends Component {
  componentWillMount() {
    const role = window.localStorage.role;
    this.props.sessionInit(role);
  }

  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(getTheme())}>
        <MuiThemeProviderLegacy muiTheme={muiOldTheme()}>
          {this.props.children}
        </MuiThemeProviderLegacy>
      </MuiThemeProvider>

    );
  }
}

Main.propTypes = {
  sessionInit: PropTypes.func,
  children: PropTypes.node,
};

const mapDispatchToProps = dispatch => ({
  sessionInit: (role) => {
    dispatch(initSession({ role }));
  },
});


export default connect(
  null,
  mapDispatchToProps,
)(Main);
