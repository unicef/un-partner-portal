import React from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';
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

    <button type="submit" hidden aria-hidden={true} />
  </form>
);

export const FORM_NAME = 'passwordReset';

export default compose(
  reduxForm({
    form: FORM_NAME,
  }),
  withStyles(styleSheet, { name: 'PasswordResetForm' }),
)(PasswordResetForm);
