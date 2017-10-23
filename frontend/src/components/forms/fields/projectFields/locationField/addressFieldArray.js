import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { GoogleApiWrapper } from 'google-maps-react';
import ArrayForm from '../../../arrayForm';
import TextFieldForm from '../../../../forms/textFieldForm';
import AddressMapField from './addressMapField';

const messages = {
  country: 'Country',
  location: 'Location of office(s)',
};

const countryName = name => () => (
  <TextFieldForm
    label={messages.country}
    fieldName={'countryName'}
    optional
    textFieldProps={{
      inputProps: {
        initial: name,
      },
    }}
    readOnly
  />
);

const Locations = (formName, name, loaded, readOnly) => () => loaded && <AddressMapField
  formName={formName}
  name={name}
  readOnly={readOnly}
/>;


const LocationFieldArray = (props) => {
  const { formName, readOnly, name, country, loaded, ...other } = props;
  return (<ArrayForm
    limit={1}
    initial
    label={messages.location}
    disableAdding
    fieldName="array_tmp_field"
    outerField={countryName(country)}
    innerField={Locations(formName, name, loaded, readOnly, ...other)}
    {...other}
  />);
};

LocationFieldArray.propTypes = {
  formName: PropTypes.string,
  name: PropTypes.string,
  country: PropTypes.string,
  readOnly: PropTypes.bool,
  loaded: PropTypes.bool,
};

const WrappedLocationFieldArray = GoogleApiWrapper({
  version: '3.exp',
  apiKey: process.env.GOOGLE_KEY,
})(LocationFieldArray);

const connected = connect(
  (state, ownProps) => {
    const countryProfile = R.find(country => country.id === Number(ownProps.params.id), state.countryProfiles.hq.country_profiles);
    const country = countryProfile ? state.countries[countryProfile.country_code] : {};

    return {
      country,
    };
  },
)(WrappedLocationFieldArray);

export default withRouter(connected);

