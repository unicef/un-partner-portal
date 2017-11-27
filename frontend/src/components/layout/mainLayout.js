import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
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

// TODO check what can be done in muiTheme
const styleSheet = theme => ({
  root: {
    margin: 'auto',
  },
  leftHeader: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary[500],
  },
  rightHeader: {
    // dark blue color added as extra to regular palette
    backgroundColor: theme.palette.primary.strong,
  },
  paper: {
    height: '100%',
    borderRight: `1px ${theme.palette.primary[300]} solid`,
  },
  paper2: {
    height: '100%',
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

class MainLayout extends Component {
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
    const { classes, children } = this.props;
    return (
      <Grid item >
        <Grid container spacing={0} className={classes.root}>
          <Grid item sm={2} hidden={{ xsDown: true }} className={classes.noPrint}>
            <AppBar
              className={`${classes.header} ${classes.leftHeader}`}
              position="static"
              color="accent"
            >
              <Typography type="display1" color="inherit" alignItems="center">
              UNPP
              </Typography>
            </AppBar>
          </Grid>
          <Grid item xs={12} sm={10} className={classes.noPrint}>
            <AppBar
              className={`${classes.header} ${classes.rightHeader}`}
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
          </Grid>
          <Grid item xs={12} sm={2} className={classes.noPrint}>
            <Paper className={classes.paper}>
              <SidebarMenu />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Paper className={classes.paper2}>
              {children}
            </Paper>
          </Grid>
        </Grid>
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
      </Grid>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styleSheet, { name: 'mainLayout' })(MainLayout);
