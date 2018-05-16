import React from 'react';
import PropTypes from 'prop-types';

import TextFieldForm from '../../../textFieldForm';

const messages = {
  label: 'Justification Summary',
};

const JustificationSummary = (props) => {
  const { name, disabled, ...other } = props;
  return (
    <TextFieldForm
      fieldName={`${name}.justification_reason`}
      label={messages.label}
      textFieldProps={{
        multiline: true,
        InputProps: {
          inputProps: {
            maxLength: '5000',
          },
        },
        disabled,
      }}
      {...other}
    />
  );
};

JustificationSummary.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default JustificationSummary;
