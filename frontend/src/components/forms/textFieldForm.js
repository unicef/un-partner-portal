import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import { renderTextField } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';


function TextFieldForm(props) {
  const {
    fieldName,
    label,
    textFieldProps,
    placeholder,
    optional,
    validation,
    value,
    warn,
  } = props;
  return (
    <Grid item>
      <FormControl fullWidth>
        <FormLabel>{label}</FormLabel>
        <Field
          name={fieldName}
          placeholder={placeholder || `Provide ${label[0].toLowerCase() + label.slice(1)}`}
          component={renderTextField}
          validate={optional ? [] : [required].concat(validation || [])}
          warn={warn && warning}
          initialValues={value}
          {...textFieldProps}
        />
      </FormControl>
    </Grid>
  );
}


TextFieldForm.propTypes = {
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
   * default value
   */
  value: PropTypes.string,
  /**
   * validations passed to field
   */
  warn: PropTypes.bool,
};

TextFieldForm.defaultProps = {
  placeholder: null,
};


export default TextFieldForm;
