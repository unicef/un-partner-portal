import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';

import { mapSpecializationsToSelection } from '../../../../../store';


const messages = {
  label: 'Criteria',
};

const values = [
  { value: 'SEE', label: 'Criteria expertise and experience' },
  { value: 'Pro', label: 'Project management' },
  { value: 'LEP', label: 'Local experience and presence' },
  { value: 'Con', label: 'Contribution of resource' },
  { value: 'Cos', label: 'Cost effectiveness' },
  { value: 'Exp', label: 'Experience working with UN' },
  { value: 'Rel', label: 'Relevance of proposal to achieving expected results' },
  { value: 'Cla', label: 'Clarity of activities and expected results' },
  { value: 'Inn', label: 'Innovative approach' },
  { value: 'Sus', label: 'Sustainability of intervention' },
  { value: 'Rea', label: 'Realistic timelines and plans' },
  { value: 'ASC', label: 'Access/security considerations' },
  { value: 'Oth', label: 'Other' },
];

const CriteriaField = (props) => {
  const { name, fields, index, ...other } = props;
  const chosenCriteria = fields.getAll().map(field => field.display_type);
  const ownCriteria = fields.get(index).display_type;
  const newValues = values.filter(value =>
    (ownCriteria === value.value) || !(chosenCriteria.includes(value.value)));
  return (
    <SelectForm
      fieldName={`${name}.display_type`}
      label={messages.label}
      values={newValues}
      selectFieldProps={{
        multiple: true,
      }}
      {...other}
    />
  );
};

CriteriaField.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  fields: PropTypes.array,
  disabled: PropTypes.bool,
};

export default connect(
  (state, ownProps) => (
    { areas: ownProps.sectorId
      ? mapSpecializationsToSelection(state, ownProps.sectorId)
      : [],
    }),
)(CriteriaField);
