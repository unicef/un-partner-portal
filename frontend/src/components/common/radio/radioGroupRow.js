import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { RadioGroup } from 'material-ui/Radio';

export const styleSheet = () => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const RadioGroupRow = (props) => {
  const { classes, selectedValue, onChange, children, ...other } = props;

  return (<RadioGroup
    {...other}
    className={classes.row}
    value={selectedValue}
    onChange={(event, value) => onChange(event, value)}
  >
    {children}
  </RadioGroup>);
};

RadioGroupRow.propTypes = {
  classes: PropTypes.object,

  selectedValue: PropTypes.string,

  onChange: PropTypes.func,

  children: PropTypes.element,
};

export default withStyles(styleSheet, { name: 'RadioGroupRow' })(RadioGroupRow);

