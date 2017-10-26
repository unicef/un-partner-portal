
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SelectForm from '../../../selectForm';
import { selectNormalizedCountries } from '../../../../../store';

const COUNTRY = 'Country';

const CountryField = (props) => {
  const { fieldName, label, countries, ...other } = props;
  return (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={countries}
      {...other}
    />
  );
};

CountryField.propTypes = {
  fieldName: PropTypes.string,
  countries: PropTypes.array,
  label: PropTypes.string,
};

CountryField.defaultProps = {
  label: COUNTRY,
};

export default connect(
  state => ({
    countries: selectNormalizedCountries(state),
  }),
)(CountryField);

