import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import MenuLink from '../components/layout/menuLink';

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
});

function sidebarMenu(props) {
  const { classes, router: { location: { pathname } }, sidebar, onItemClick } = props;

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

    return link;
  });

  return (
    <Grid className={classes.sidebar} container spacing={0}>
      <List>
        {links}
      </List>
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
  sidebar: state.idPortalNav,
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
