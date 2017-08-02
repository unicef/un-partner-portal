import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initSession } from '../reducers/session';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import getTheme from '../styles/muiTheme';



class Main extends Component {

  componentWillMount() {
    const role = window.localStorage.role;
    this.props.sessionInit(role);
  }

  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(getTheme())}>
        {this.props.children}
      </MuiThemeProvider>

    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sessionInit: (role) => {
      dispatch(initSession({ role }))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Main)
