
import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import CountryField from './countryField';
import { selectNormalizedCountries } from '../../../../../store';

const COUNTRY = 'country';

const LocationsCountry = (props) => {
  const { name, countries, initialCountry } = props;
  return (
    <CountryField
      fieldName={`${name}.${COUNTRY}`}
      label="Country"
      suggestionsPool={countries}
      initialValue={initialCountry}
    />
  );
};

LocationsCountry.propTypes = {
  name: PropTypes.string,
  countries: PropTypes.array,
  initialCountry: PropTypes.string,
};

const connectedLocationsCountry = connect(
  (state, ownProps) => {
    let countries = state.countries;
    const selector = formValueSelector(ownProps.formName);
    const countryValue = selector(state, `${ownProps.name}`);
    let initialCountry;
    if (countryValue) {
      initialCountry = countryValue.country;
      const { country } = countryValue;
      let values = selector(state, 'countries').map(val => val[COUNTRY]);
      values = R.without([country], values);
      countries = R.omit(values, countries);
    }
    const normalizedCountries = selectNormalizedCountries({ countries });
    return {
      countries: normalizedCountries,
      initialCountry };
  },
)(LocationsCountry);

export default connectedLocationsCountry;
