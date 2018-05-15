
import React from 'react';
import PropTypes from 'prop-types';
import ArrayForm from '../../components/forms/arrayForm';
import SelectForm from '../../components/forms/selectForm';
import LocationsCountry from '../../components/forms/fields/projectFields/locationField/locationsCountry';
import { hasLocations } from '../../helpers/validation';

const Country = formName => sector => (
  <LocationsCountry
    name={sector}
    formName={formName}
  />
);

//TODO import roles from constants
const Roles = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenSectors = fields.getAll().map(field => field.sector);
  const ownSector = fields.get(index).sector;
  const newValues = values.filter(value =>
    (ownSector === value.value) || !(chosenSectors.includes(value.value)));
  return (<SelectForm
    fieldName={'role'}
    label="Roles"
    values={[]}
    readOnly={readOnly}
    {...props}
  />
  );
};


const RoleField = (props) => {
  const { formName, readOnly, loaded, ...other } = props;

  return (<ArrayForm
    limit={230}
    label="Role per office"
    initial
    validate={[hasLocations]}
    fieldName="countries"
    outerField={Country(formName, ...other)}
    innerField={Roles(['a', 'b', 'c'], readOnly, ...other)}
    {...other}
  />);
};

RoleField.propTypes = {
  formName: PropTypes.string,
  readOnly: PropTypes.bool,
  loaded: PropTypes.bool,
};

export default RoleField;

