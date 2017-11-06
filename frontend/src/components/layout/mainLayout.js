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
import LensIcon from 'material-ui-icons/Lens';
import Badge from 'material-ui/Badge';
import NotificationsList from '../notifications/notificationsList';
import SidebarMenu from './sidebarMenu';

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
  badge: {
    backgroundColor: 'red',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
  },
  iconBox: {
    width: 48,
    height: 48,
    marginRight: 5,
  },
  headerIcon: {
    fill: theme.palette.primary[400],
  },
});

class MainLayout extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, children } = this.props;
    return (
      <Grid item >
        <Grid container spacing={0} className={classes.root}>
          <Grid item sm={2} hidden={{ xsDown: true }}>
            <AppBar
              className={`${classes.header} ${classes.leftHeader}`}
              position="static"
              color="accent"
            >
              <Typography type="display1" color="inherit" align="center">
              UNPP
              </Typography>
            </AppBar>
          </Grid>
          <Grid item xs={12} sm={10}>
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
                <Badge
                  badgeContent=" "
                  className={classes.iconBox}
                  classes={{ badge: classes.badge }}
                >
                  <IconButton color="contrast" onClick={this.handleClick}>
                    <LensIcon className={`${classes.iconBox} ${classes.headerIcon}`} />
                  </IconButton>
                </Badge>
                <IconButton color="contrast">
                  <AccountIcon className={`${classes.iconBox} ${classes.headerIcon}`} />
                </IconButton>
              </Grid>
            </AppBar>
          </Grid>
          <Grid item xs={12} sm={2}>
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
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onRequestClose={this.handleRequestClose}
        >
          <NotificationsList />
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
