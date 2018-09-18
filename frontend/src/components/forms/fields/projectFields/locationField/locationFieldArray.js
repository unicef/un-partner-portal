import React from 'react';
import PropTypes from 'prop-types';
import ArrayForm from '../../../arrayForm';
import LocationsMap from './locationsMapField';
import LocationsCountry from './locationsCountry';
import { hasLocations } from '../../../../../helpers/validation';

const Country = formName => sector => (
  <LocationsCountry
    name={sector}
    formName={formName}
  />
);

const Locations = (formName) => (name, index) =>
  <LocationsMap
    formName={formName}
    name={name}
    index={index}
  />
;

const LocationFieldArray = (props) => {
  const { formName, readOnly, ...other } = props;
  return (<ArrayForm
    limit={230}
    label="Project Location"
    initial
    validate={[hasLocations]}
    fieldName="countries"
    outerField={Country(formName, ...other)}
    innerField={Locations(formName, ...other)}
    {...other}
  />);
};

LocationFieldArray.propTypes = {
  formName: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default (LocationFieldArray);

