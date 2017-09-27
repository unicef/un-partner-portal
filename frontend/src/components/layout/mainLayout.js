import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountCircle';
import LensIcon from 'material-ui-icons/Lens';
import Badge from 'material-ui/Badge';

import SidebarMenu from './sidebarMenu';

const label = {
  switchTo: 'Switch to',
};

// TODO check what can be done in muiTheme
const styleSheet = theme => ({
  root: {
    margin: 'auto',
  },
  leftHeader: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.accent[500],
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


//Remove when sesion controlled by auth user
const switchToRole = () => {
  const role = window.localStorage.role;

  if (role === 'partner') {
    return `${label.switchTo} agency`;
  }

  return `${label.switchTo} partner`;
};

//Remove when sesion controlled by auth user
const onRoleSwitch = () => {
  const role = window.localStorage.role;

  if (role === 'partner') {
    window.localStorage.setItem('role', 'agency');
  } else if (role === 'agency') {
    window.localStorage.setItem('role', 'partner');
  }

  window.location.reload();
};

const mainLayout = (props) => {
  const classes = props.classes;
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
              <Button onClick={() => onRoleSwitch()} raised color="accent">{switchToRole()}</Button>
              <Badge
                badgeContent=" "
                className={classes.iconBox}
                classes={{ badge: classes.badge }}
              >
                <IconButton color="contrast">
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
            {props.children}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

mainLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styleSheet, { name: 'mainLayout' })(mainLayout);
