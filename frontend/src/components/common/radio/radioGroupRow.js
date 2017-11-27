import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { RadioGroup } from 'material-ui/Radio';

export const styleSheet = () => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 14,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 14,
  },
});

const RadioGroupRow = (props) => {
  const { classes, selectedValue, onChange, children, column, ...other } = props;
  return (<RadioGroup
    {...other}
    className={column ? classes.column : classes.row}
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
  column: PropTypes.array,
};

export default withStyles(styleSheet, { name: 'RadioGroupRow' })(RadioGroupRow);

