import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  default: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
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

const menuLink = (props) => {
  const { active, onClick, icon, label, classes } = props;
  return (
    <ListItem
      className={active ? 'active' : ''}
      classes={{
        button: classes.button,
        default: classes.default,
      }}
      button
      onClick={onClick}
    >
      <Hidden mdDown>
        <ListItemIcon className={classes.icon}>
          {icon}
        </ListItemIcon>
      </Hidden>
      <ListItemText primary={label} disableTypography />
    </ListItem>
  );
};

menuLink.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'menuLink' })(menuLink);
