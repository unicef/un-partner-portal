
import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import CountryField from './countryField';
import { selectNormalizedCountries } from '../../../../../store';

const COUNTRY = 'country';

const LocationsCountry = (props) => {
  const { name, countries } = props;

  return (
    <CountryField
      fieldName={`${name}.${COUNTRY}`}
      label="Country"
      suggestionsPool={countries}
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
