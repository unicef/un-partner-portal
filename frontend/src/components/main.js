import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';

import { initSession } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import { loadPartnerConfig } from '../reducers/partnerProfileConfig';
import { loadSectors } from '../reducers/sectors';
import getTheme, { muiOldTheme } from '../styles/muiTheme';


class Main extends Component {
  componentWillMount() {
    let role = window.localStorage.role;

    if (!role) {
      window.localStorage.setItem('role', 'partner');
      role = 'partner';
    }
    this.props.sessionInit(role);
    this.props.loadCountries();
    this.props.loadPartnerConfig();
    this.props.loadSectors();
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
  loadCountries: PropTypes.func,
  loadPartnerConfig: PropTypes.func,
  loadSectors: PropTypes.func,
  children: PropTypes.node,
};

const mapDispatchToProps = dispatch => ({
  sessionInit: (role) => {
    dispatch(initSession({ role }));
  },
  loadCountries: () => loadCountries(dispatch),
  loadSectors: () => dispatch(loadSectors()),
  loadPartnerConfig: () => dispatch(loadPartnerConfig()),
});


export default connect(
  null,
  mapDispatchToProps,
)(Main);
