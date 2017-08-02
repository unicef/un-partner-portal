import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import DraftsIcon from 'material-ui-icons/Drafts';

import MenuLink from './menuLink';


const styleSheet = createStyleSheet('sidebarMenu', theme => ({

  sidebar: {
    height: '100%',
    justifyContent: 'space-between',
  },
  logo: {
    padding: 15,
    margin: 'auto',
    background: theme.palette.primary[500],
  }
}));

function sidebarMenu(props, context) {
  const { classes, location, sidebar, onItemClick } = props;
  const links = sidebar.map((item, index) => {
    const link = <MenuLink
      active={location.includes(item.path)}
      label={item.label}
      key={index}
      icon={createElement(DraftsIcon)}
      onClick={() => { onItemClick(index, item.path) }} />
    if (item.path === '/settings') {
      return [
        <Divider />,
        link
      ]
    }
    return link
  });

  return (
    <Grid className={classes.sidebar} container gutter={0}>
      <List>
        {links}
      </List>
      <Paper className={classes.logo} elevation={0}>
        User logo
      </Paper>
    </Grid>

  );
}

sidebarMenu.propTypes = {
  location: PropTypes.string.isRequired,
  sidebar: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    location: state.route.location,
    sidebar: state.nav.sidebar
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onItemClick: (id, path) => {
      history.push(path)
    }
  }
}

const containerSidebarMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(sidebarMenu);

export default withStyles(styleSheet)(withRouter(containerSidebarMenu));
