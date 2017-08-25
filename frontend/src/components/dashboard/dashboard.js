import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText, FormLabel } from 'material-ui/Form'
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/Button';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import DatePicker from 'material-ui-old/DatePicker';
import DatePickerForm from '../forms/datePickerForm';


var today = new Date();
var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

class RegistrationStep extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dialogShown: false,
      dialogDate: null,
    }
    this.openDialog = this.openDialog.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }


  openDialog() {
    /**
     * if the date is not selected then set it to new date
     * (get the current system date while doing so)
     * else set it to the currently selected date
     */
    if (this.state.date !== undefined) {
      this.setState({
        dialogDate: this.getDate(),
        dialogShown: true,
      });
    } else {
      this.setState({
        dialogDate: new Date(),
        dialogShown: true,
      });
    }
  }


  handleTouchTap() {
    setTimeout(() => {
      this.openDialog();
    }, 0);
  }

  render() {
    const { handleSubmit } = this.props;
    const { dialogShown, dialogDate } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <DatePickerForm 
          warn
          fieldName="datePicker"
          label="Date Picker"
        />

      </form >

    );
  }
};

RegistrationStep.propTypes = {
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * callback for 'back' button
   */
  handlePrev: PropTypes.func,
  /**
   * component to be wrapped
   */
  children: PropTypes.node.isRequired,
  /**
   * whether step is the first, to control buttons appearance
   */
  first: PropTypes.bool,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.bool,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'test',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: values => console.log(values),
})(RegistrationStep);
