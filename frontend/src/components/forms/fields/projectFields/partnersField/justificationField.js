import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';
import { selectNormalizedDirectJustification } from '../../../../../store';

const messages = {
  label: 'Justification for Direct Selection/Retention',
};

const JustificationField = (props) => {
  const { name, disabled, justifications, ...other } = props;
  return (
    <SelectForm
      fieldName={`${name}.ds_justification_select`}
      label={messages.label}
      values={justifications}
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
  justifications: PropTypes.array,
};

const mapStateToProps = state => ({
  justifications: selectNormalizedDirectJustification(state),
});

export default connect(mapStateToProps)(JustificationField);
