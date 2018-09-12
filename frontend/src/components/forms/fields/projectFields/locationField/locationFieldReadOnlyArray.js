
import React from 'react';
import ArrayForm from '../../../arrayForm';
import CountryField from './countryField';
import LocationsMap from './locationsMapField';
import TextField from '../../../textFieldForm';

const messages = {
  projectLocation: 'Project location',
};

const Country = (name, index) => (
  <CountryField
    fieldName={`${name}.country`}
    readOnly
    key={index}
  />
);

const adminLevel = (formName) => (name, index) => {
  return <LocationsMap
    formName={formName}
    name={name}
    index={index}
    readOnly
  />
};

const LocationFieldArray = (props) => {
  const { formName, ...other } = props;

  return (<ArrayForm
    limit={230}
    label={messages.adminLevel}
    fieldName="locations_edit"
    outerField={Country}
    innerField={adminLevel(formName, ...other)}
    readOnly
    {...other}
  />);
};

export default (LocationFieldArray);

