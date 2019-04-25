import R from "ramda";
import React from "react";
import PropTypes from "prop-types";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import ArrayForm from "../../../components/forms/arrayForm";
import SelectForm from "../../../components/forms/selectForm";
import { hasLocations } from "../../../helpers/validation";
import {
  selectNormalizedRoleChoices,
  selectNormalizedOffices,
  selectNormalizedOfficesFilter
} from "../../../store";
import { AGENCY_ROLES } from "../../../helpers/permissions";

const Office = (
  officeId,
  role,
  values,
  readOnly,
  officesFilter,
  id,
  ...props
) => (member, index, fields) => {
  const chosenOffices = fields.getAll().map(field => field.office_id);
  const ownOffice = fields.get(index).office_id;
  let newValues = values.filter(
    value => ownOffice === value.value || !chosenOffices.includes(value.value)
  );

  if (
    (fields.get(index).office_id &&
      !fields.get(index).readOnly &&
      id &&
      role !== AGENCY_ROLES.HQ_EDITOR) ||
    (!fields.get(index).readOnly && fields.get(index).office_id)
  ) {
    newValues = officesFilter.filter(value => ownOffice === value.value);
  }
  
  return (
    <SelectForm
      fieldName={`${member}.office_id`}
      label="Office"
      values={newValues}
      readOnly={
        readOnly ||
        (fields.get(index).office_id &&
          fields.get(index).office_id !== officeId &&
          role !== AGENCY_ROLES.HQ_EDITOR)
      }
      {...props}
    />
  );
};

const Roles = (officeId, role, values, readOnly, id, ...props) => (
  member,
  index,
  fields
) => {
  const ownOffice = fields.get(index).office_id;
  const readOnlyByOffice =
    role !== AGENCY_ROLES.HQ_EDITOR && ownOffice !== officeId;

  return (
    <SelectForm
      fieldName={`${member}.role`}
      label="Roles"
      values={values}
      readOnly={readOnly || readOnlyByOffice}
      {...props}
    />
  );
};

const RoleField = props => {
  const {
    officeId,
    role,
    formName,
    offices,
    roleChoices,
    officesFilter,
    readOnly,
    id,
    officesValue,
    ...other
  } = props;

  const filterOffices = R.filter(
    item => item.office_id === officeId,
    officesValue
  );
  const limit =
    filterOffices.length > 0 ? officesValue.length : officesValue.length + 1;
  return (
    <ArrayForm
      limit={limit}
      label="Role per office"
      initial
      validate={[hasLocations]}
      fieldName="office_memberships"
      outerField={Office(
        officeId,
        role,
        offices,
        readOnly,
        officesFilter,
        id,
        formName,
        ...other
      )}
      innerField={Roles(officeId, role, roleChoices, readOnly, id, ...other)}
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
  id: PropTypes.number
};

const selector = formValueSelector("newUserForm");

export default connect(state => ({
  roleChoices: selectNormalizedRoleChoices(state),
  offices: selectNormalizedOffices(state),
  officesFilter: selectNormalizedOfficesFilter(state),
  role: state.session.officeRole,
  officeId: state.session.officeId,
  officesValue: selector(state, "office_memberships") || []
}))(RoleField);
