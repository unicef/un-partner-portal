import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    root: {
      width: '100%',
      paddingTop: `${padding}px`,
      background: theme.palette.background.paper,
    },
    default: {
      userSelect: 'none',
      padding: 0,
    },
    checked: {
      color: theme.palette.accent[500],
    },
    disabled: {
      color: theme.palette.accent[200],
    },
  };
};

const CountryProfileItem = (props) => {
  const { classes, selected, country, handleToggle } = props;

  return (
    <ListItem
      classes={{ default: classes.default }}
      key={country.id}
      onClick={() => handleToggle(country)}
    >
      <Checkbox
        checked={country.profile ? true : selected}
        disabled={country.profile}
        tabIndex="-1"
        classes={{
          checked: classes.checked,
          disabled: classes.disabled,
        }}
      />

      <ListItemText
        disableTypography
        classes={{ root: classes.default }}
        primary={country.name}
      />

    </ListItem>
  );
};

CountryProfileItem.propTypes = {
  classes: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default withStyles(styleSheet, { name: 'CountryProfileItem' })(CountryProfileItem);
