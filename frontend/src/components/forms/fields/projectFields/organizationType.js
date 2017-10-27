
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SelectForm from '../../selectForm';
import { selectNormalizedOrganizationTypes } from '../../../../store';


const CountryField = (props) => {
  const { fieldName, label, values, ...other } = props;
  return (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={values}
      {...other}
    />
  );
};

CountryField.propTypes = {
  fieldName: PropTypes.string,
  values: PropTypes.array,
  label: PropTypes.string,
};

export default connect(
  state => ({
    values: selectNormalizedOrganizationTypes(state),
  }),
)(CountryField);

