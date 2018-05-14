import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Popover from 'material-ui/Popover';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountCircle';
import BadgeIcon from '../components/layout/badgeIcon';
import Logout from '../components/layout/logout';
import Options from '../components/layout/options';

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
      profileOpen: false,
    }; 

    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleProfileOnClose = this.handleProfileOnClose.bind(this);
  }

  handleProfileClick(event) {
    this.setState({ profileOpen: true, profileAnchor: event.currentTarget });
  }

  handleProfileOnClose() {
    this.setState({ profileOpen: false });
  }
  render() {
    const { classes } = this.props;
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
            <Grid item>
              <IconButton color="contrast" onClick={this.handleProfileClick}>
                <AccountIcon className={`${classes.iconBox} ${classes.headerIcon}`} />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
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
          onClose={this.handleProfileOnClose}
        >
          <Logout />
          <Options />
        </Popover>
      </React.Fragment>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet, { name: 'MainAppBar' })(MainAppBar);
