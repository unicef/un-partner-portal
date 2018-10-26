import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from 'material-ui/styles';
import { loadUserData, loginSuccess } from '../../reducers/session';
import Card from '../common/cardLogin';
import PaddedContent from '../common/paddedContent';
import Loader from '../common/loader';

const messages = {
  title: 'UN Partner Portal',
};

const styleSheet = theme => ({
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: theme.palette.primary[300],
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

class LoginToken extends Component {

  componentDidMount() {
    const { params, loadUserInfo, loggedIn } = this.props;
    window.localStorage.setItem('token', params.token);
    loggedIn(params.token);
    loadUserInfo().then(() => {
      history.push('/');
    }).catch(() => {
      history.push('/');
    });
  }

  render() {
    return (<Card title={messages.title}>
      <PaddedContent big>
        <Loader loading />
      </PaddedContent>
    </Card>);
  }
}

LoginToken.propTypes = {
  loadUserInfo: PropTypes.func,
  loggedIn: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(loadUserData()),
  loggedIn: token => dispatch(loginSuccess({ user: '', token })),
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withStyles(styleSheet, { name: 'LoginToken' }),
)(LoginToken);