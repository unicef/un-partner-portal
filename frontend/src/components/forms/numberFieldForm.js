import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import { renderNumberField, renderText } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';


function NumberFieldForm(props) {
  const {
    fieldName,
    label,
    textFieldProps,
    placeholder,
    optional,
    validation,
    warn,
    readOnly,
  } = props;

  return (
    <Grid item>
      <FormControl fullWidth>
        {readOnly
          ? [
            <Field
              name={fieldName}
              label={label}
              component={renderText}
              optional={optional}
            />]
          : [
            <FormLabel>{label}</FormLabel>,
            <Field
              name={fieldName}
              placeholder={placeholder || `Provide ${label.toLowerCase()}`}
              component={renderNumberField}
              validate={(optional ? [] : [required]).concat(validation || [])}
              warn={warn && warning}
              {...textFieldProps}
            />]
        }
      </FormControl>
    </Grid>
  );
}


NumberFieldForm.propTypes = {
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field, also placeholder is built from it by adding 'Provide'
   */
  label: PropTypes.node,
  /**
   * props passed to wrapped TextField
   */
  textFieldProps: PropTypes.node,
  /**
   * unique text used as placeholder
   */
  placeholder: PropTypes.string,
  /**
   * if field is optional
   */
  optional: PropTypes.bool,
  /**
   * validations passed to field
   */
  validation: PropTypes.arrayOf(PropTypes.func),
  /**
   * validations passed to field
   */
  warn: PropTypes.bool,
  /**
   * if form should be displayed in read only state
   */
  readOnly: PropTypes.bool,
};

NumberFieldForm.defaultProps = {
  placeholder: null,
};


export default NumberFieldForm;
