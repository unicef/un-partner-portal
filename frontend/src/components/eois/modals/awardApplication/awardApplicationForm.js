import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  label: 'Justification',
  score: 'Your score',
};

const styleSheet = () => ({
  spread: {
    minWidth: 500,
  },
});


const AddReview = (props) => {
  const { classes, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <TextFieldForm
        className={classes.spread}
        label={messages.label}
        fieldName="justification_reason"
        textFieldProps={{
          multiline: true,
          inputProps: {
            maxLength: '5000',
          },
        }}
      />
    </form >
  );
};

AddReview.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const formAddReview = reduxForm({
  form: 'awardApplication',
})(AddReview);

export default withStyles(styleSheet)(formAddReview);
