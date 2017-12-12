import React from 'react';
import { reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import Typography from 'material-ui/Typography';
import GridColumn from '../common/grid/gridColumn';
import { loginUser } from '../../reducers/session';
import TextFieldForm from '../forms/textFieldForm';
import PasswordFieldForm from '../forms/passwordFieldForm';

const styleSheet = (theme) => {
  const paddingFields = theme.spacing.unit * 5;
  const paddingField = theme.spacing.unit * 3;
  return {
    root: {
      minHeight: '50vh',
    },
    fields: {
      padding: `${paddingFields}px`,
    },
    logIn: {
      color: theme.palette.secondary[500],
    },
    field: {
      paddingTop: `${paddingField}px`,
    },
    lineHeight: {
      lineHeight: '24px',
    },
  };
};

const handleLogin = (values, dispatch) => dispatch(loginUser(values)).catch((error) => {
  const errorMsg = error.response.data.non_field_errors || 'Login failed!';
  throw new SubmissionError({
    ...error.response.data,
    _error: errorMsg,
  });
});

const Login = (props) => {
  const { handleSubmit, pristine, submitting, error, classes, dispatch, form } = props;
  return (
    <div >
      <form onSubmit={handleSubmit}>
        <GridColumn className={classes.root}>
          <Grid className={classes.field} container justify="center">
            <Typography type="display1" className={classes.logIn}>Log in</Typography>
          </Grid>
          <div className={classes.fields}>
            <TextFieldForm
              label="E-mail"
              placeholder="Please use your email to login"
              fieldName="email"
            />
            <div className={classes.field}>
              <PasswordFieldForm
                label="Password"
                fieldName="password"
              />
            </div>
          </div>
          <Grid container justify="center" >
            <Button onTouchTap={handleSubmit} raised color="accent" disabled={pristine || submitting}>
            Log in
            </Button>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={error}
            message={error}
            autoHideDuration={4e3}
            onRequestClose={() => dispatch(clearSubmitErrors(form))}
          />
        </GridColumn>
      </form >
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.object,
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  form: PropTypes.string,
  dispatch: PropTypes.func,
};

const LoginForm = reduxForm({
  form: 'login',
  onSubmit: handleLogin,
})(Login);

export default withStyles(styleSheet, { name: 'LoginForm' })(LoginForm);
