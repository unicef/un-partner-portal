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
import Loader from '../components/common/loader';
import { SESSION_STATUS } from '../helpers/constants';


class Main extends Component {
  componentWillMount() {
    this.props.loadCountries();
    this.props.loadPartnerConfig();
    this.props.loadSectors();
  }

  render() {
    const { status, children } = this.props;
    return (
      <MuiThemeProvider theme={createMuiTheme(getTheme())}>
        <MuiThemeProviderLegacy muiTheme={muiOldTheme()}>
          <Loader loading={status === SESSION_STATUS.CHANGING} fullScreen >
            {(status === SESSION_STATUS.READY) ? children : null}
          </Loader>
        </MuiThemeProviderLegacy>
      </MuiThemeProvider>);
  }
}

Main.propTypes = {
  loadCountries: PropTypes.func,
  loadPartnerConfig: PropTypes.func,
  loadSectors: PropTypes.func,
  children: PropTypes.node,
  role: PropTypes.string,
  status: PropTypes.string,
};

const mapStateToProps = state => ({
  status: state.session.state,
  role: state.session.role,
});

const mapDispatchToProps = dispatch => ({
  loadCountries: () => loadCountries(dispatch),
  loadSectors: () => dispatch(loadSectors()),
  loadPartnerConfig: () => dispatch(loadPartnerConfig()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
