import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { loadAgencyMembers } from '../reducers/agencyMembers';
import { loadCountries } from '../reducers/countries';
import { loadPartnerConfig } from '../reducers/partnerProfileConfig';
import { loadSectors } from '../reducers/sectors';
import { loadPartnerNames } from '../reducers/partnerNames';
import getTheme, { muiOldTheme } from '../styles/muiTheme';

import { ROLES } from '../helpers/constants';


class Main extends Component {
  componentWillMount() {
    const { session,
      loadCountries,
      loadPartnerConfig,
      loadSectors,
      loadAgencyMembers,
      getPartnerNames,
    } = this.props;
    loadCountries();
    loadPartnerConfig();
    loadSectors();
    if (session.role === ROLES.AGENCY) {
      loadAgencyMembers(session.agencyId);
      getPartnerNames();
    }
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

Main.propTypes = {
  loadCountries: PropTypes.func,
  loadPartnerConfig: PropTypes.func,
  loadSectors: PropTypes.func,
  loadAgencyMembers: PropTypes.func,
  children: PropTypes.node,
  session: PropTypes.object,
  getPartnerNames: PropTypes.func,
};

const mapStateToProps = state => ({
  session: state.session,

});

const mapDispatchToProps = dispatch => ({
  loadCountries: () => dispatch(loadCountries()),
  loadSectors: () => dispatch(loadSectors()),
  loadPartnerConfig: () => dispatch(loadPartnerConfig()),
  loadAgencyMembers: agencyId => dispatch(loadAgencyMembers(agencyId)),
  getPartnerNames: () => dispatch(loadPartnerNames()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
