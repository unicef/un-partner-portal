import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import { compose } from 'redux';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';

import PasswordFieldForm from '../forms/passwordFieldForm';
import { password, sameAs } from '../../helpers/validation';

const messages = {
  matchPasswords: 'Passwords don\'t match',
};

const matchPasswords = sameAs('new_password1', messages.matchPasswords);

const styleSheet = (theme) => ({
  row: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 5}px`,
  },
});

const PasswordResetForm = ({
  handleSubmit,
  classes,
  clearSubmitErrors,
  error,
  form,
}) => (
  <form
    onSubmit={handleSubmit}
    noValidate
  >
    <div className={classes.row}>
      <PasswordFieldForm
        label="Password"
        fieldName="new_password1"
        validation={[password]}
      />
    </div>

    <div className={classes.row}>
      <PasswordFieldForm
        label="Repeat password"
        fieldName="new_password2"
        validation={[password, matchPasswords]}
        placeholder="Repeat password"
      />
    </div>

    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!error}
      message={error}
      autoHideDuration={4000}
      onClose={() => clearSubmitErrors(form)}
    />

    <button type="submit" hidden aria-hidden={true} />
  </form>
);

export const FORM_NAME = 'passwordReset';

export default compose(
  reduxForm({
    form: FORM_NAME,
  }),
  connect(
    null,
    { clearSubmitErrors },
  ),
  withStyles(styleSheet, { name: 'PasswordResetForm' }),
)(PasswordResetForm);
