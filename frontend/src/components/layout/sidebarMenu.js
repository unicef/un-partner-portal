import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LoggedOrg from './loggedOrg/loggedOrg';
import MenuLink from './menuLink';

const styleSheet = theme => ({
  sidebar: {
    height: '100%',
    alignContent: 'space-between',
  },
  logo: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      position: 'inherit',
    },
    width: theme.spacing.unit * 28,
    position: 'fixed',
    bottom: 0,
  },
  innerLogo: {
    padding: theme.spacing.unit * 2,
  },
  icon: {
    color: 'inherit',
  },
  button: {
    '&:hover': {
      backgroundColor: theme.palette.primary[200],
      color: theme.palette.secondary[500],
    },
    '&.active': {
      backgroundColor: theme.palette.primary[200],
      color: theme.palette.secondary[500],
    },
  },
});

function sidebarMenu(props) {
  const { classes, router: { location: { pathname } }, sidebar, onItemClick } = props;
  const links = sidebar.map((item, index) => {
    const link = (
      <MenuLink
        active={pathname.includes(item.path)}
        label={item.label}
        key={index}
        icon={createElement(item.icon)}
        classes={{
          button: classes.button,
          icon: classes.icon,
        }}
        onClick={() => onItemClick(index, item.path)}
      />
    );
    if (item.path === '/settings' || item.path === '/profile') {
      return [
        <Divider />,
        link,
        <Divider />,
      ];
    }
    return link;
  });

  return (
    <Grid className={classes.sidebar} container spacing={0}>
      <List>
        {links}
      </List>
      <div className={classes.logo}>
        <Divider />
        <div className={classes.innerLogo}>
          <LoggedOrg />
        </div>
        <Divider />
      </div>
    </Grid>

  );
}

sidebarMenu.propTypes = {
  router: PropTypes.object.isRequired,
  sidebar: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onItemClick: PropTypes.func,
};

const mapStateToProps = state => ({
  sidebar: state.nav,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

const containerSidebarMenu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(sidebarMenu);

export default withStyles(styleSheet, { name: 'sidebarMenu' })(withRouter(containerSidebarMenu));
