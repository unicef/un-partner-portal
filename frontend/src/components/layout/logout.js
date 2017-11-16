import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import SignOut from 'material-ui-icons/PowerSettingsNew';
import IconWithTextButton from '../common/iconWithTextButton';
import { logoutUser } from '../../reducers/session';

const messages = {
  signOut: 'Sign out',
};

const styleSheet = theme => ({
  root: {
    width: '25vw',
    '&:hover': {
      backgroundColor: theme.palette.common.darkGreyBackground,
    },
  },
});


class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };
  }

  render() {
    const { classes, logout } = this.props;
    return (
      <Paper className={classes.root}>
        <IconWithTextButton
          icon={<SignOut />}
          text={messages.signOut}
          onClick={logout}
          textProps={{
            type: 'body2',
          }}
        />
      </Paper>
    );
  }
}

Logout.propTypes = {
  classes: PropTypes.object,
  logout: PropTypes.func,
};


const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutUser()),
});

const connectedLogout =
  connect(null, mapDispatch)(Logout);

export default withStyles(styleSheet, { name: 'Logout' })(connectedLogout);

