
import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import ArrayForm from '../../../arrayForm';
import LocationsMap from './locationsMapField';
import LocationsCountry from './locationsCountry';


const Country = formName => sector => (
  <LocationsCountry
    name={sector}
    formName={formName}
  />
);

const Locations = (formName, loaded) => (name, index) => loaded && <LocationsMap
  formName={formName}
  name={name}
  index={index}
/>;


const LocationFieldArray = (props) => {
  const { formName, readOnly, loaded, ...other } = props;
  return (<ArrayForm
    limit={230}
    label="Project Location"
    initial
    fieldName="countries"
    outerField={Country(formName, ...other)}
    innerField={Locations(formName, loaded, ...other)}
    {...other}
  />);
};


const WrappedLocationFieldArray = GoogleApiWrapper({
  version: '3.exp',
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo',
})(LocationFieldArray);


export default (WrappedLocationFieldArray);

