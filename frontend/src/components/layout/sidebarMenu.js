import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import SettingsIcon from 'material-ui-icons/Settings';
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
    width: '100%',
  },
  innerLogo: {
    padding: theme.spacing.unit * 2,
  },
  icon: {
    padding: '0',
    transform: 'translate(20px, 0)',
  },
  default: {
    fontSize: '14px',
  },
});

const messages = {
  button: 'User Management',
};

function sidebarMenu(props) {
  const {
    classes,
    router: { location: { pathname } },
    sidebar,
    onItemClick,
    onSettingsClick,
  } = props;
  const links = sidebar.map((item, index) => {
    const link = (
      <MenuLink
        active={pathname.includes(item.path)}
        label={item.label}
        key={item.label}
        icon={createElement(item.icon)}
        onClick={() => onItemClick(index, item.path)}
      />
    );
    if (item.path === '/settings' || item.path === '/profile') {
      return [
        <Divider key="divider-top" />,
        link,
        <Divider key="divider-bottom" />,
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
        <MenuLink
          label={messages.button}
          icon={createElement(SettingsIcon)}
          onClick={() => onSettingsClick('/idp/')}
          classes={{
            icon: classes.icon,
            default: classes.default,
          }}
        />
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
  onSettingsClick: PropTypes.func,
};

const mapStateToProps = state => ({
  sidebar: state.nav,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
  onSettingsClick: (path) => {
    history.push(path);
  },
});

const containerSidebarMenu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(sidebarMenu);

export default withStyles(styleSheet, { name: 'sidebarMenu' })(withRouter(containerSidebarMenu));
