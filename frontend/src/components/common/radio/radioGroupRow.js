import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { RadioGroup } from 'material-ui/Radio';

const styleSheet = createStyleSheet('BasicInformation', () => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const RadioGroupRow = (props) => {
  const { classes, selectedValue, onChange, children, ...other } = props;

  return (<RadioGroup
    {...other}
    className={classes.row}
    selectedValue={selectedValue}
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

export default withStyles(styleSheet)(RadioGroupRow);

