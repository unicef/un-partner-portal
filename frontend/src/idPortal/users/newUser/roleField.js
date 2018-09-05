
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../components/forms/arrayForm';
import SelectForm from '../../../components/forms/selectForm';
import { hasLocations } from '../../../helpers/validation';
import { selectNormalizedRoleChoices, selectNormalizedOffices } from '../../../store';

const Office = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenOffices = fields.getAll().map(field => field.office_id);
  const ownOffice = fields.get(index).office_id;
  const newValues = values.filter(value =>
    (ownOffice === value.value) || !(chosenOffices.includes(value.value)));

  return (<SelectForm
    fieldName={`${member}.office_id`}
    label="Office"
    values={newValues}
    readOnly={readOnly || values.length === 1}
    {...props}
  />);
};

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
  const { formName, offices, roleChoices, readOnly, loaded, ...other } = props;

  return (<ArrayForm
    limit={offices.length}
    label="Role per office"
    initial
    validate={[hasLocations]}
    fieldName="office_memberships"
    outerField={Office(offices, readOnly, formName, ...other)}
    innerField={Roles(roleChoices, readOnly, ...other)}
    {...other}
  />);
};

RoleField.propTypes = {
  formName: PropTypes.string,
  readOnly: PropTypes.bool,
  roleChoices: PropTypes.array,
  offices: PropTypes.array,
  loaded: PropTypes.bool,
};

export default connect(
  (state, ownProps) => ({
    roleChoices: selectNormalizedRoleChoices(state),
    offices: selectNormalizedOffices(state),
  }),
)(RoleField);

