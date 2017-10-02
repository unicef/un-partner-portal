import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { renderRadioField, renderText, renderBool } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';

const RadioForm = (props) => {
  const {
    fieldName,
    label,
    values,
    optional,
    validation,
    warn,
    renderTextSelection,
    readOnly,
    ...other } = props;

  return (
    <Grid item>
      {readOnly
        ? <Field
          name={fieldName}
          component={renderTextSelection ? renderText : renderBool}
          values={values}
          optional={optional}
          label={label}
        />
        : <Field
          name={fieldName}
          component={renderRadioField}
          options={values}
          label={label}
          validate={optional ? [] : [required].concat(validation || [])}
          warn={warn && warning}
          {...other}
        />}
    </Grid>
  );
};


RadioForm.propTypes = {
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field
   */
  label: PropTypes.node,
  /**
   * array of objects with values for radio button 
   * {
   *   value: name of value represented by button
   *   label: label used for button
   * }
   */
  values: PropTypes.array.isRequired,
  /**
   * if field is optional
   */
  optional: PropTypes.bool,
  /**
   * validations passed to field
   */
  validation: PropTypes.arrayOf(PropTypes.func),
  /**
   * if form should be displayed in read only state
   */
  readOnly: PropTypes.bool,

  warn: PropTypes.bool,

  renderTextSelection: PropTypes.bool,
};

export default RadioForm;
