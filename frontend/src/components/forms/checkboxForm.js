import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { FormControl } from 'material-ui/Form';
import { renderCheckbox } from '../../helpers/formHelper';
import { requiredBool, warningBool } from '../../helpers/validation';

function CheckboxForm(props) {
  const {
    fieldName,
    label,
    textFieldProps,
    optional,
    validation,
    warn,
    readOnly,
  } = props;
  return (
    <Grid item>
      <FormControl fullWidth>
        <Field
          name={fieldName}
          component={renderCheckbox}
          validate={(optional ? (validation || []) : [requiredBool].concat(validation || []))}
          warn={warn ? warningBool : null}
          disabled={readOnly}
          label={label}
          {...textFieldProps}
        />
      </FormControl>
    </Grid>
  );
}


CheckboxForm.propTypes = {
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field, also placeholder is built from it by adding 'Provide'
   */
  label: PropTypes.string,
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

CheckboxForm.defaultProps = {
  placeholder: null,
};


export default CheckboxForm;
