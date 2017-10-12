
import React from 'react';
import PropTypes from 'prop-types';
import { GoogleApiWrapper } from 'google-maps-react';
import ArrayForm from '../../../arrayForm';
import AddressMapField from './addressMapField';
import LocationsCountry from './locationsCountry';


const Country = formName => sector => (
  <LocationsCountry
    name={sector}
    formName={formName}
  />
);

const Locations = (formName, name, loaded) => () => loaded && <AddressMapField
  formName={formName}
  name={name}
/>;


const LocationFieldArray = (props) => {
  const { formName, readOnly, name, loaded, ...other } = props;
  return (<ArrayForm
    limit={1}
    label="Project Location"
    initial
    disableAdding
    fieldName="location_field_offices"
    outerField={Country(formName, ...other)}
    innerField={Locations(formName, name, loaded, ...other)}
    {...other}
  />);
};

LocationFieldArray.propTypes = {
  formName: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  loaded: PropTypes.bool,
};

const WrappedLocationFieldArray = GoogleApiWrapper({
  version: '3.exp',
  apiKey: process.env.GOOGLE_KEY,
})(LocationFieldArray);


export default (WrappedLocationFieldArray);

