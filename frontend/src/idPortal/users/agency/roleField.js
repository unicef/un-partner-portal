
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../components/forms/arrayForm';
import SelectForm from '../../../components/forms/selectForm';
import LocationsCountry from '../../../components/forms/fields/projectFields/locationField/locationsCountry';
import { hasLocations } from '../../../helpers/validation';
import { selectNormalizedRoleChoices } from '../../../store';

const Country = formName => member => (
  <LocationsCountry
    name={member}
    formName={formName}
  />
);

// TODO import roles from constants
const Roles = (values, readOnly, ...props) => member => (
  <SelectForm
    fieldName={`${member}.role`}
    label="Roles"
    values={values}
    readOnly={readOnly}
    {...props}
  />
);

const RoleField = (props) => {
  const { formName, roleChoices, readOnly, loaded, ...other } = props;

  return (<ArrayForm
    limit={230}
    label="Role per office"
    initial
    validate={[hasLocations]}
    fieldName="countries"
    outerField={Country(formName, ...other)}
    innerField={Roles(roleChoices, readOnly, ...other)}
    {...other}
  />);
};

RoleField.propTypes = {
  formName: PropTypes.string,
  readOnly: PropTypes.bool,
  roleChoices: PropTypes.array,
  loaded: PropTypes.bool,
};

export default connect(
  (state, ownProps) => ({
    roleChoices: selectNormalizedRoleChoices(state),
  }),
)(RoleField);

