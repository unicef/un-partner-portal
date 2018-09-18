import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  label: 'Justification',
  placeholder: 'Provide justification of retraction',
};

const styleSheet = () => ({
  spread: {
    minWidth: 500,
  },
});

const WithdrawAward = (props) => {
  const { classes, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <TextFieldForm
        className={classes.spread}
        label={messages.label}
        placeholder={messages.placeholder}
        fieldName="withdraw_reason"
        textFieldProps={{
          multiline: true,
          InputProps: {
            inputProps: {
              maxLength: '5000',
            },
          },
        }}
      />
    </form >
  );
};

WithdrawAward.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const formWithdrawAward = reduxForm({
  form: 'withdrawApplication',
})(WithdrawAward);

export default withStyles(styleSheet)(formWithdrawAward);
