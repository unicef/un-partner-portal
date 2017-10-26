import React from 'react';
import PropTypes from 'prop-types';

import RadioForm from '../radioForm';

const BOOL = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

const PolarRadio = (props) => {
  const { fieldName, label, ...other } = props;
  return (
    <RadioForm
      fieldName={fieldName}
      label={label}
      values={BOOL}
      {...other}
    />
  );
};

PolarRadio.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  fieldName: PropTypes.string,
  label: PropTypes.string,
};

export default PolarRadio;
