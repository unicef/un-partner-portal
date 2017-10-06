
import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import SelectForm from '../../../selectForm';
import { selectNormalizedCountries } from '../../../../../store';

const COUNTRY = 'country';

const LocationsCountry = (props) => {
  const { name, countries } = props;

  return (
    <SelectForm
      fieldName={`${name}.${COUNTRY}`}
      label="Country"
      values={countries}
    />
  );
};

LocationsCountry.propTypes = {
  name: PropTypes.string,
  countries: PropTypes.array,
};

const connectedLocationsCountry = connect(
  (state, ownProps) => {
    let countries = state.countries;
    const selector = formValueSelector(ownProps.formName);
    const countryValue = selector(state, `${ownProps.name}`);
    if (countryValue) {
      const { country } = countryValue;
      let values = selector(state, 'countries').map(val => val[COUNTRY]);
      values = R.without([country], values);
      countries = R.omit(values, countries);
    }
    const normalizedCountries = selectNormalizedCountries({ countries });
    return { countries: normalizedCountries };
  },
)(LocationsCountry);

export default connectedLocationsCountry;
