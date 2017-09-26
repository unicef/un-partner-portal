import React from 'react';
import PropTypes from 'prop-types';
import SelectForm from '../../../selectForm';


const messages = {
  label: 'Criteria',
};

const CriteriaField = (props) => {
  const { name, values, fields, index, ...other } = props;
  const chosenCriteria = fields.getAll().map(field => field.display_type);
  const ownCriteria = fields.get(index).display_type;
  const newValues = values.filter(value =>
    (ownCriteria === value.value) || !(chosenCriteria.includes(value.value)));
  return (
    <SelectForm
      fieldName={`${name}.display_type`}
      label={messages.label}
      values={newValues}
      {...other}
    />
  );
};

CriteriaField.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  fields: PropTypes.array,
  disabled: PropTypes.bool,
  values: PropTypes.array,
};

export default CriteriaField;
