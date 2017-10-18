import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import EoiCountryCell from '../../../components/eois/cells/eoiCountryCell';

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
        checked={R.is(Object, country) ? true : selected}
        disabled={R.is(Object, country)}
        tabIndex="-1"
      />

      <ListItemText
        disableTypography
        classes={{ root: classes.default }}
        primary={<EoiCountryCell code={R.is(Object, country) ? country.country_code : country} />}
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
