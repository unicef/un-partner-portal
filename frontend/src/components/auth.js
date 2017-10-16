import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';

import { initSession, loadUserData } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import { SESSION_STATUS } from '../helpers/constants';


class Auth extends Component {
  componentWillMount() {
    const { sessionInit, loadUserInfo } = this.props;
    let role = window.localStorage.role;
    if (!role) {
      role = 'partner';
      window.localStorage.setItem('role', role);
    }
    const token = window.localStorage.token;
    sessionInit({ role, token });
    loadUserInfo();
    loadCountries();
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

Auth.propTypes = {
  sessionInit: PropTypes.func,
  loadUserInfo: PropTypes.func,
  children: PropTypes.node,

};

const mapDispatchToProps = dispatch => ({
  sessionInit: (session) => {
    dispatch(initSession(session));
  },
  loadUserInfo: () => dispatch(loadUserData()),
  loadCountries: () => loadCountries(dispatch),
});


export default connect(
  null,
  mapDispatchToProps,
)(Auth);
