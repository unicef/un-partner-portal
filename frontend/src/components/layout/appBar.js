import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Popover from 'material-ui/Popover';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountCircle';
import BadgeIcon from './badgeIcon';
import NotificationsList from '../notifications/notificationsList';
import Logout from './logout';
import Options from './options';
import { checkPermission, COMMON_PERMISSIONS } from '../../helpers/permissions';


const styleSheet = theme => ({
  leftHeader: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: theme.spacing.unit * 28,
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: theme.palette.secondary[500],
  },
  rightHeader: {
    flexShrink: 1,
    // dark blue color added as extra to regular palette
    backgroundColor: theme.palette.primary.strong,
    '-ms-grid-column': 2,
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
    this.handleVerificationClose = this.handleVerificationClose.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleProfileRequestClose = this.handleProfileRequestClose.bind(this);
  }

  handleVerificationClick(event) {
    this.setState({ verificationOpen: true, notifAnchor: event.currentTarget });
  }

  handleVerificationClose() {
    this.setState({ verificationOpen: false });
  }

  handleProfileClick(event) {
    this.setState({ profileOpen: true, profileAnchor: event.currentTarget });
  }

  handleProfileRequestClose() {
    this.setState({ profileOpen: false });
  }
  render() {
    const { classes, hasPermission } = this.props;
    return (
      <React.Fragment>
        <AppBar
          className={`${classes.header} ${classes.leftHeader} ${classes.noPrint}`}
          position="static"
          color="accent"
        >
          <Typography type="display1" color="inherit">
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
            {hasPermission && <Grid item>
              <BadgeIcon handleClick={this.handleVerificationClick} />
            </Grid>}
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
          onClose={this.handleVerificationClose}
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
          onClose={this.handleProfileRequestClose}
        >
          <Logout onClose={this.handleProfileRequestClose} />
        </Popover>
      </React.Fragment>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  hasPermission: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasPermission: checkPermission(COMMON_PERMISSIONS.RECEIVE_NOTIFICATIONS, state),
});

const containerMainAppBar = connect(mapStateToProps)(MainAppBar);

export default withStyles(styleSheet, { name: 'MainAppBar' })(containerMainAppBar);
