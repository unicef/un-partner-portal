import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import DateRange from 'material-ui-icons/DateRange';

import { renderDatePicker } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';

class DatePickerForm extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedDate: undefined };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ selectedDate: value });
  }

  render() {
    const {
      fieldName,
      label,
      datePickerProps,
      placeholder,
      optional,
      validation,
      warn,
    } = this.props;
    return (
      <Grid item>
        <FormControl fullWidth>
          <FormLabel>{label}</FormLabel>
          <Grid container direction="row" gutter={4} align="center">
            <Grid item xs={2} md={1}>
              <DateRange />
            </Grid>
            <Grid item xs={10} md={11}>
              <Field
                name={fieldName}
                component={renderDatePicker}
                validate={optional ? [] : [required].concat(validation || [])}
                hintText={placeholder || `Provide ${label[0].toLowerCase() + label.slice(1)}`}
                warn={warn && warning}
                textFieldStyle={{
                  width: '100%',
                  'line-height': null,
                  height: 40,
                }}
                {...datePickerProps}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
    );
  }
}


DatePickerForm.propTypes = {
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
  datePickerProps: PropTypes.node,
  /**
   * unique text used as placeholder
   */
  placeholder: PropTypes.text,
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
};

DatePickerForm.defaultProps = {
  placeholder: null,
};


export default DatePickerForm;
