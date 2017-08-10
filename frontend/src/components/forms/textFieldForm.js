import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';

import { renderTextField } from '../helpers/formHelper';


class TextFieldForm extends Component {

  render() {
    const { fieldName, label, textFieldProps, placeholder=null } = this.props;
    return (
      <Grid item>
        <FormControl fullWidth>
          <FormLabel>{label}</FormLabel>
          <Field
            name={fieldName}
            placeholder={placeholder || `Provide ${label[0].toLowerCase() + label.slice(1)}`}
            component={renderTextField}
            {...textFieldProps}
          />
        </FormControl>
      </Grid>
    )
  }
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
   * Mark the step as completed. Is passed to child components.
   */
}

export default TextFieldForm;
