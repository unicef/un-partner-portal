import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LoggedOrg from './loggedOrg/loggedOrg';
import MenuLink from './menuLink';
import Hidden from 'material-ui/Hidden';
import Popover from 'material-ui/Popover';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountCircle';
import BadgeIcon from './badgeIcon';
import NotificationsList from '../notifications/notificationsList';
import SidebarMenu from './sidebarMenu';
import Logout from './logout';

const styleSheet = theme => ({
  root: {
    height: 60,
    display: 'flex',
    width: '100%',
  },
  leftHeader: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: theme.spacing.unit * 28,
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary[500],
  },
  rightHeader: {
    // dark blue color added as extra to regular palette
    flexShrink: 1,
    backgroundColor: theme.palette.primary.strong,
  },
  iconBox: {
    width: 48,
    height: 48,
  },
  headerIcon: {
    fill: theme.palette.primary[400],
  },
  noPrint: {
    '@media print': {
      display: 'none',
    },
  },
});

class MainAppBar extends Component {
  constructor() {
    super();
    this.state = {
      notifAnchor: null,
      profileAnchor: null,
      verificationOpen: false,
      profileOpen: false,
    };
    this.handleVerificationClick = this.handleVerificationClick.bind(this);
    this.handleVerificationRequestClose = this.handleVerificationRequestClose.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleProfileRequestClose = this.handleProfileRequestClose.bind(this);
  }

  handleVerificationClick(event) {
    this.setState({ verificationOpen: true, notifAnchor: event.currentTarget });
  }

  handleVerificationRequestClose() {
    this.setState({ verificationOpen: false });
  }

  handleProfileClick(event) {
    this.setState({ profileOpen: true, profileAnchor: event.currentTarget });
  }

  handleProfileRequestClose() {
    this.setState({ profileOpen: false });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar
          className={`${classes.header} ${classes.leftHeader} ${classes.noPrint}`}
          position="static"
          color="accent"
        >
          <Typography type="display1" color="inherit" alignItems="center">
              UNPP
          </Typography>
        </AppBar>
        <AppBar
          className={`${classes.header} ${classes.rightHeader} ${classes.noPrint}`}
          position="static"
          color="primary"
        >
          <Grid
            container
            direction="row"
            justify="flex-end"
            spacing={0}
          >
            <Grid item>
              <BadgeIcon handleClick={this.handleVerificationClick} />
            </Grid>
            <Grid item>
              <IconButton color="contrast" onClick={this.handleProfileClick}>
                <AccountIcon className={`${classes.iconBox} ${classes.headerIcon}`} />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        <Popover
          id="notifications"
          anchorEl={this.state.notifAnchor}
          open={this.state.verificationOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onRequestClose={this.handleVerificationRequestClose}
        >
          <NotificationsList />
        </Popover>
        <Popover
          id="partnerProfile"
          anchorEl={this.state.profileAnchor}
          open={this.state.profileOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onRequestClose={this.handleProfileRequestClose}
        >
          <Logout />
        </Popover>
      </div>
    );
  }
}

MainAppBar.propTypes = {
  router: PropTypes.object.isRequired,
  sidebar: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onItemClick: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'MainAppBar' })(MainAppBar);
