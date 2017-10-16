import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import GridColumn from '../common/grid/gridColumn';

import MenuLink from './menuLink';

const messages = {
  logged: 'Logged in as:',
};

const styleSheet = theme => ({
  sidebar: {
    height: '100%',
    justifyContent: 'space-between',
  },
  logo: {
    width: '100%',
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
  const { classes, router: { location: { pathname } }, sidebar, onItemClick, user } = props;
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
          <GridColumn>
            <Typography type="caption">
              {messages.logged}
            </Typography>
            <Typography type="body2">
              {user}
            </Typography>
          </GridColumn>
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
  user: state.session.email,
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
