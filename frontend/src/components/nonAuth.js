import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';

import { initSession, loadUserData } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import { SESSION_STATUS } from '../helpers/constants';
import Loader from '../components/common/loader';

// component for routes that don't need to authenthicate token on the backend like login 
// and registration
class Auth extends Component {
  componentWillMount() {
    const { sessionInit } = this.props;
    let role = window.localStorage.role;
    if (!role) {
      role = 'partner';
      window.localStorage.setItem('role', role);
    }
    sessionInit({ role });
  }

  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider theme={createMuiTheme(getTheme())}>
        <MuiThemeProviderLegacy muiTheme={muiOldTheme()}>
          {children}
        </MuiThemeProviderLegacy>
      </MuiThemeProvider>);
  }
}

Auth.propTypes = {
  sessionInit: PropTypes.func,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  status: state.session.state,
});

const mapDispatchToProps = dispatch => ({
  sessionInit: (session) => {
    dispatch(initSession(session));
  },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auth);
