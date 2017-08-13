import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Hidden from 'material-ui/Hidden';

const menuLink = (props) => {
  const { active, onClick, icon, label } = props;
  return (
    <ListItem
      className={active ? 'active' : ''}
      button
      onClick={onClick}
    >
      <Hidden mdDown>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
      </Hidden>
      <ListItemText primary={label} disableTypography />
    </ListItem>
  );
};

menuLink.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string,
};

export default menuLink;
