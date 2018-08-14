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
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import R from 'ramda';
import Card from '../common/cardLogin';
import SetPasswordForm, { FORM_NAME } from './setPasswordForm';
import { changePassword } from '../../reducers/session';


const messages = {
  title: 'UN Partner Portal',
  subtitle: 'Set password',
  failed: 'Couldn\'t set password',

  continue: 'Continue',
  register: 'Register',
  cancel: 'Cancel',
  terms: <div>{'I have read and agree to the'} <a href="">{'Terms of Use and Privacy Policy'}</a> {'on UN Partner Portal'}</div>,
};

const styleSheet = (theme) => ({
  heading: {
    color: theme.palette.secondary[500],
  },
  row: {
    margin: `${theme.spacing.unit * 4}px 0`,
    textAlign: 'center',
  },
  center: {
    margin: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
  },
});

class SetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      termsOfUse: false,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck() {
    this.setState({ termsOfUse: !this.state.termsOfUse });
  }

  termsOfUse() {
    const { classes } = this.props;

    return (<div className={classes.center}>
      <Checkbox
        checked={this.state.termsOfUse}
        onChange={this.handleCheck}
      />
      <Typography type="body1">{messages.terms}</Typography>
    </div>);
  }

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

        <SetPasswordForm onSubmit={this.onSubmit} />
        {this.termsOfUse()}
        <div className={classes.row}>
          <Button
            type="submit"
            raised
            color="accent"
            disabled={pristine || submitting || !this.state.termsOfUse}
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
  withStyles(styleSheet, { name: 'SetPassword' }),
)(SetPassword);
