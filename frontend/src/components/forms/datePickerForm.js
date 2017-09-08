import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import moment from 'moment';
import { renderDatePicker, renderText } from '../../helpers/formHelper';
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
      readOnly,
      warn,
    } = this.props;
    return (
      <Grid item>
        <FormControl fullWidth>
          {readOnly
            ? <Field
              name={fieldName}
              label={label}
              component={renderText}
              optional={optional}
            />
            : [<FormLabel>{label}</FormLabel>,
              <Field
                name={fieldName}
                component={readOnly ? renderText : renderDatePicker}
                validate={optional ? [] : [required].concat(validation || [])}
                hintText={placeholder || `Provide ${label[0].toLowerCase() + label.slice(1)}`}
                warn={warn && warning}
                format={(value) => {
                  if (value && value !== 'Invalid date') return new Date(`${value}T00:00:00.000Z`);
                  return value;
                }}
                normalize={value => moment(value).format('YYYY-MM-DD').toString()}
                textFieldStyle={{
                  width: '100%',
                  'line-height': null,
                  height: 40,
                }}
                {...datePickerProps}
              />]
          }
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

DatePickerForm.defaultProps = {
  placeholder: null,
};


export default DatePickerForm;
