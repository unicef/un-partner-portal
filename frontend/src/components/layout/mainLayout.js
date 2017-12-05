import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
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
import MainAppBar from './appBar';

// TODO check what can be done in muiTheme
const styleSheet = theme => ({
  root: {
    margin: 'auto',
  },
  rightItem: {
    height: '100%',
    width: '100%',
    flexShrink: 1,
  },
  border: {
  },
  leftItem: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    width: theme.spacing.unit * 28,
    flex: '0 0 auto',
    borderRight: `2px ${theme.palette.primary[300]} solid`,
  },
  paper: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
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
      <Grid container spacing={0} className={classes.root}>
        <MainAppBar />
        <Paper className={classes.paper}>
          <div className={`${classes.leftItem} ${classes.noPrint}`}>
            <SidebarMenu />
          </div>
          <div className={classes.rightItem}>
            {children}
          </div>
        </Paper>
      </Grid>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styleSheet, { name: 'mainLayout' })(MainLayout);
