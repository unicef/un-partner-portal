import React, { Component } from 'react';
import { Field } from 'redux-form';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';

import { renderTextField } from '../../lib/formHelper';

class TextFieldForm extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { fieldName, label } = this.props;
    return (
      <Grid item>
        <FormControl>
          <FormLabel>{label}</FormLabel>
          <Field
            name={fieldName}
            placeholder={label}
            component={renderTextField}
          />
        </FormControl>
      </Grid>
    )
  }
};

export default TextFieldForm;
