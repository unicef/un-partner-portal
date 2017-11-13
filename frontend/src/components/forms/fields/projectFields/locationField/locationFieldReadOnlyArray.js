
import React from 'react';
import ArrayForm from '../../../arrayForm';
import CountryField from './countryField';
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

const adminLevel = (name, index) => (
  <TextField
    fieldName={`${name}.adminLevel`}
    readOnly
    key={index}
  />
);

const LocationFieldArray = (props) => {
  const { ...other } = props;
  return (<ArrayForm
    limit={230}
    label={messages.adminLevel}
    fieldName="locations"
    outerField={Country}
    innerField={adminLevel}
    readOnly
    {...other}
  />);
};

export default (LocationFieldArray);

