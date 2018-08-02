import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import SignOut from 'material-ui-icons/PowerSettingsNew';
import Person from 'material-ui-icons/Person';
import IconWithTextButton from '../common/iconWithTextButton';
import { logoutUser } from '../../reducers/session';

const messages = {
  signOut: 'Sign out',
  profile: 'User Profile',
};

const styleSheet = theme => ({
  root: {
    width: '15vw',
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

    this.openProfilePage = this.openProfilePage.bind(this);
  }

  openProfilePage() {
    const { onClose } = this.props;

    history.push('/user');
    onClose();
  }

  render() {
    const { classes, logout } = this.props;
    return (
      <Paper >
        <div className={classes.root}>
          <IconWithTextButton
            icon={<Person />}
            text={messages.profile}
            onClick={this.openProfilePage}
            textProps={{
              type: 'body2',
            }}
          />
        </div>
        <div className={classes.root}>
          <IconWithTextButton
            className={classes.root}
            icon={<SignOut />}
            text={messages.signOut}
            onClick={logout}
            textProps={{
              type: 'body2',
            }}
          />
        </div>
      </Paper>
    );
  }
}

Logout.propTypes = {
  classes: PropTypes.object,
  logout: PropTypes.func,
  onClose: PropTypes.func,
};

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutUser()),
});

const connectedLogout =
  connect(null, mapDispatch)(Logout);

export default withStyles(styleSheet, { name: 'Logout' })(connectedLogout);

