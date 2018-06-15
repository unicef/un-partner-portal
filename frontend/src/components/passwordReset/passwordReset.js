import React, { Component } from 'react';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  isPristine,
  isSubmitting,
  SubmissionError,
  submit,
} from 'redux-form';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import R from 'ramda';

import Card from '../common/cardLogin';
import PasswordResetForm, { FORM_NAME } from './passwordResetForm';
import { changePassword } from '../../reducers/session';

const messages = {
  title: 'UN Partner Portal',
  subtitle: 'Change password',
  failed: 'Couldn\'t change password',
};

const styleSheet = (theme) => ({
  heading: {
    color: theme.palette.secondary[500],
  },
  row: {
    margin: `${theme.spacing.unit * 4}px 0`,
    textAlign: 'center',
  },
});

class PasswordReset extends Component {
  render() {
    const {
      classes,
      pristine,
      submitting,
      submit,
    } = this.props;

    return (
      <Card title={messages.title}>
        <div className={classes.row}>
          <Typography
            className={classes.heading}
            type="display1"
          >
            {messages.subtitle}
          </Typography>
        </div>

        <PasswordResetForm onSubmit={this.onSubmit} />

        <div className={classes.row}>
          <Button
            type="submit"
            raised
            color="accent"
            disabled={pristine || submitting}
            onTouchTap={submit}
          >
            Save
          </Button>
        </div>
      </Card>
    );
  }

  onSubmit = (values) => {
    const { changePassword, params } = this.props;

    return changePassword({
      ...values,
      ...R.pick(['token', 'uid'], params),
    })
        .then(() => history.push('/login'))
        .catch(({ response }) => {
          const errorMsg = response.data.non_field_errors || messages.failed;

          throw new SubmissionError({
            ...response.data,
            _error: errorMsg,
          });
        });
  }
}

const mapStateToProps = (state) => ({
  pristine: isPristine(FORM_NAME)(state),
  submitting: isSubmitting(FORM_NAME)(state),
});

const mapDispatchToProps = {
  submit: () => submit(FORM_NAME),
  changePassword,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withStyles(styleSheet, { name: 'PasswordReset' }),
)(PasswordReset);
