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
  }

  render() {
    const { status, children } = this.props;
    return (
      <Loader loading={status === SESSION_STATUS.CHANGING} fullScreen >
        {(status === SESSION_STATUS.READY) ? children : null}
      </Loader>

    );
  }
}

Auth.propTypes = {
  sessionInit: PropTypes.func,
  loadUserInfo: PropTypes.func,
  children: PropTypes.node,
  status: PropTypes.string,
};

const mapStateToProps = state => ({
  status: state.session.state,
});

const mapDispatchToProps = dispatch => ({
  sessionInit: (session) => {
    dispatch(initSession(session));
  },
  loadUserInfo: () => dispatch(loadUserData()),
  loadCountries: () => loadCountries(dispatch),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auth);
