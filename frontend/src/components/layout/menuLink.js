import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Hidden from 'material-ui/Hidden';

const menuLink = (props) => {
  return (
    <ListItem className={props.active ? 'active' : ''}
      button
      onClick={props.onClick}>
      <Hidden mdDown>
        <ListItemIcon >
          {props.icon}
        </ListItemIcon>
      </Hidden>
      <ListItemText primary={props.label} disableTypography />
    </ListItem>
  )
}

menuLink.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string
};

export default menuLink;
