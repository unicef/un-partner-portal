import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import GridColumn from '../common/grid/gridColumn';
import { loginUser } from '../../reducers/session';
import TextFieldForm from '../forms/textFieldForm';
import PasswordFieldForm from '../forms/passwordFieldForm';


const handleLogin = (values, dispatch) => {
  return dispatch(loginUser(values)).catch((error) => {
    const errorMsg = error.response.data.non_field_errors || 'Login failed!';
    throw new SubmissionError({
      ...error.response.data,
      _error: errorMsg,
    });
  });
};
const Login = (props) => {
  const { handleSubmit, pristine, submitting, submitFailed, error } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <TextFieldForm
          label="Login (e-mail)"
          placeholder="Please use your email to login"
          fieldName="email"
        />
        <PasswordFieldForm
          label="Password"
          fieldName="password"
        />
        <Grid container justify="flex-end" >
          <Button onTouchTap={handleSubmit} color="accent" disabled={pristine || submitting}>
            Submit
          </Button>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={error}
          message={error}
        />
      </GridColumn>


    </form >
  );
};

Login.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

const LoginForm = reduxForm({
  form: 'login',
  onSubmit: handleLogin,
})(Login);

export default LoginForm;
