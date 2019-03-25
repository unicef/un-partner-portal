import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArrayForm from "../../../components/forms/arrayForm";
import SelectForm from "../../../components/forms/selectForm";
import { hasLocations } from "../../../helpers/validation";
import {
  selectNormalizedRoleChoices,
  selectNormalizedOffices,
  selectNormalizedOfficesFilter
} from "../../../store";

const Office = (values, readOnly, officesFilter, id, ...props) => (member, index, fields) => {
  const chosenOffices = fields.getAll().map(field => field.office_id);
  const ownOffice = fields.get(index).office_id;
  let newValues = values.filter(
    value => ownOffice === value.value || !chosenOffices.includes(value.value)
  );

  if (!fields.get(index).is_role_editable && id) {
    newValues = officesFilter.filter(value => ownOffice === value.value);
  }

  return (
    <SelectForm
      fieldName={`${member}.office_id`}
      label="Office"
      values={newValues}
      readOnly={readOnly || values.length === 1}
      {...props}
    />
  );
};

const Roles = (values, readOnly, id, ...props) => (member, index, fields) => (
  <SelectForm
    fieldName={`${member}.role`}
    label="Roles"
    values={values}
    readOnly={readOnly || (!fields.get(index).is_role_editable && id)}
    {...props}
  />
);

const RoleField = props => {
  const { formName, offices, roleChoices, officesFilter, readOnly, id, ...other } = props;

  return (
    <ArrayForm
      limit={offices.length}
      label="Role per office"
      initial
      validate={[hasLocations]}
      fieldName="office_memberships"
      outerField={Office(offices, readOnly, officesFilter, id, formName, ...other)}
      innerField={Roles(roleChoices, readOnly, id, ...other)}
      {...other}
    />
  );
};

RoleField.propTypes = {
  formName: PropTypes.string,
  readOnly: PropTypes.bool,
  roleChoices: PropTypes.array,
  offices: PropTypes.array,
  officesFilter: PropTypes.array,
  id: PropTypes.number,
};

export default connect((state) => ({
  roleChoices: selectNormalizedRoleChoices(state),
  offices: selectNormalizedOffices(state),
  officesFilter: selectNormalizedOfficesFilter(state)
}))(RoleField);
