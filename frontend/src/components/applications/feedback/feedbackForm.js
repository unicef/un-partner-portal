import React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { reduxForm } from 'redux-form';
import { updateApplicationFeedback } from '../../../reducers/applicationFeedback';
import TextField from '../../forms/textFieldForm';

const messages = {
  placeholder: 'Provide optional feedback',
  button: 'send',
};

const handleSubmit = (values, dispatch, ownProps) =>
  ownProps.postFeedback({ feedback: values[`feedback_${ownProps.applicationId}`] }).then(() => {
    ownProps.reset();
  });

const Feedback = ({ handleSubmit, applicationId }) => (<form onSubmit={handleSubmit}>
  <TextField
    fieldName={`feedback_${applicationId}`}
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
