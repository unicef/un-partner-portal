import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import SnackbarContainer from '../components/common/snackbarContainer';
import { loadCountries } from '../reducers/countries';
import { loadPartnerConfig } from '../reducers/partnerProfileConfig';
import { loadSectors } from '../reducers/sectors';
import { loadOffices } from '../reducers/offices';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      configLoaded: false,
      error: null,
    };
  }

  componentDidMount() {
    const { getCountries,
      getPartnerConfig,
      getSectors,
      getOffices,
    } = this.props;
    const configPromises = [
      getCountries(),
      getPartnerConfig(),
      getSectors(),
      getOffices(),
    ];
    Promise.all(configPromises).then(() => {
      this.setState({ configLoaded: true });
    }).catch((error) => {
      this.setState({ error });
    });
  }

  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider theme={createMuiTheme(getTheme())}>
        <MuiThemeProviderLegacy muiTheme={muiOldTheme()}>
          <SnackbarContainer>
            {this.state.configLoaded && children}
          </SnackbarContainer>
        </MuiThemeProviderLegacy>
      </MuiThemeProvider>);
  }
}

Main.propTypes = {
  children: PropTypes.node,
  session: PropTypes.object,
  loadPartnerConfig: PropTypes.func,
  getCountries: PropTypes.func,
  getSectors: PropTypes.func,
  getOffices: PropTypes.func,
  getPartnerConfig: PropTypes.func,
};

const mapStateToProps = state => ({
  session: state.session,
});


const mapDispatchToProps = dispatch => ({
  getCountries: () => dispatch(loadCountries()),
  getSectors: () => dispatch(loadSectors()),
  getOffices: () => dispatch(loadOffices()),
  getPartnerConfig: () => dispatch(loadPartnerConfig()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
