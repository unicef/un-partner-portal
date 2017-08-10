import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControlLabel } from 'material-ui/Form';

import { renderFormControl } from '../helpers/formHelper';


const styleSheet = createStyleSheet("BasicInformation", theme => ({

  formContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkedRadio: {
    color: theme.palette.accent[500]
  },
  rootRadio: {
    height: '100%'
  }
}))

class RadioForm extends Component {

  constructor(props) {
    super(props);
    this.state = { selectedRadio: undefined };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.props.onFieldChange && this.props.onFieldChange(value);
    this.setState({ selectedRadio: value });
  }


  render() {
    const { classes, fieldName, label, values } = this.props;
    return (
      <Grid item>
        <Field name={fieldName} component={renderFormControl}>
          <FormLabel>{label}</FormLabel>
          <RadioGroup className={classes.formContainer}
            selectedValue={this.state.selectedRadio}
            onChange={this.handleChange}>
            {values.map((value, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={value.value}
                  control={<Radio classes={{
                    root: classes.rootRadio, 
                    checked: classes.checkedRadio }} />}
                  label={value.label}
                />
              )}
            )}
          </RadioGroup>
        </Field>
      </Grid>
    )
  }
}

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
   * callback to save selected value in parent's state
   */
  onFieldChange: PropTypes.func,
}
export default withStyles(styleSheet)(RadioForm);
