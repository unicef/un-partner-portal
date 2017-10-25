import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import { reduxForm } from 'redux-form';
import HeaderList from '../../common/list/headerList';
import { selectApplicationFeedback } from '../../../store';
import { loadApplicationFeedback, updateApplicationFeedback } from '../../../reducers/applicationFeedback';
import SpreadContent from '../../common/spreadContent';
import PaddedContent from '../../common/paddedContent';
import TextField from '../../forms/textFieldForm';
import GridColumn from '../../common/grid/gridColumn';
import { formatDateForPrint } from '../../../helpers/dates';
import { ROLES } from '../../../helpers/constants';

const messages = {
  placeholder: 'Provide optional feedback',
  button: 'send',
};

const handleSubmit = (values, dispatch, ownProps) => {
  ownProps.postFeedback(values);
};


const Feedback = ({ handleSubmit }) => (<form onSubmit={handleSubmit}>
  <TextField
    fieldName="feedback"
    placeholder={messages.placeholder}
    optional
  />
  <Grid container justify="flex-end" >
    <Grid item>
      <Button
        color="accent"
        onClick={handleSubmit}
      >
        {messages.button}
      </Button>
    </Grid>
  </Grid>
</form>);

const FeedbackForm = reduxForm({
  form: 'feedback',
  onSubmit: handleSubmit,
})(Feedback);

const mapDispatchToProps = (dispatch, ownProps) => ({
  postFeedback: body => dispatch(updateApplicationFeedback(ownProps.applicationId, body)),
});


export default connect(null, mapDispatchToProps)(FeedbackForm);
