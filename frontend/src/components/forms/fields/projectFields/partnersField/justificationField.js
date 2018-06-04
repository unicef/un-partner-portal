import React from 'react';
import PropTypes from 'prop-types';

import SelectForm from '../../../selectForm';

const messages = {
  label: 'Justification for Direct Selection/Retention',
};

const values = [
  { value: 'Kno', label: 'Known expertise' },
  { value: 'Loc', label: 'Local presence' },
  { value: 'Inn', label: 'Innovative approach' },
  { value: 'TCC', label: 'Time constraints/criticality of response' },
  { value: 'Imp', label: 'Importance of strengthening national civil society engagement' },
  { value: 'Oth', label: 'Other' },
];

const JustificationField = (props) => {
  const { name, disabled, ...other } = props;
  return (
    <SelectForm
      fieldName={`${name}.ds_justification_select`}
      label={messages.label}
      values={values}
      multiple
      selectFieldProps={{
        disabled,
      }}
      {...other}
    />
  );
};

JustificationField.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default JustificationField;
