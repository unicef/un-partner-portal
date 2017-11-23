import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { loadCountries } from '../reducers/countries';
import { loadPartnerConfig } from '../reducers/partnerProfileConfig';
import { loadSectors } from '../reducers/sectors';
import getTheme, { muiOldTheme } from '../styles/muiTheme';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      configLoaded: false,
      error: null,
    };
  }

  componentWillMount() {
    const { session,
      loadCountries,
      loadPartnerConfig,
      loadSectors,
    } = this.props;
    const configPromises = [
      loadCountries(),
      loadPartnerConfig(),
      loadSectors(),
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
          {this.state.configLoaded && children}
        </MuiThemeProviderLegacy>
      </MuiThemeProvider>);
  }
}

Main.propTypes = {
  loadCountries: PropTypes.func,
  loadPartnerConfig: PropTypes.func,
  loadSectors: PropTypes.func,
  children: PropTypes.node,
  session: PropTypes.object,
};

const mapStateToProps = state => ({
  session: state.session,

});

const mapDispatchToProps = dispatch => ({
  loadCountries: () => dispatch(loadCountries()),
  loadSectors: () => dispatch(loadSectors()),
  loadPartnerConfig: () => dispatch(loadPartnerConfig()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
