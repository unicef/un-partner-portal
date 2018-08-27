import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import CheckCircle from 'material-ui-icons/CheckCircle';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import PaddedContent from '../../../../common/paddedContent';
import TextFieldForm from '../../../../forms/textFieldForm';
import { updateApplication } from '../../../../../reducers/partnerApplicationDetails';
import ResultRadio from './resultRadio';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../../helpers/permissions';

const styleSheet = theme => ({
  container: {
    background: theme.palette.common.lightGreyBackground,
  },
  checked: {
    fill: theme.palette.common.statusOk,
    margin: `0 0 0 ${theme.spacing.unit / 2}px`,
  },
  declined: {
    fill: theme.palette.error[500],
    margin: `0 0 0 ${theme.spacing.unit / 2}px`,
  },
  iconWithText: {
    display: 'flex',
    alignItems: 'center',
  },
});

const messages = {
  title: 'Result',
  expected: notifDate => `Notification of results will be made by: ${notifDate}`,
  labels: {
    notif: 'Notification of Results Date',
    chosen: 'Your concept note has been selected for a potential partnership!',
    chosenQuestion: 'Would you like to accept and move forward with your application?',
    confirm: 'Confirm your participation:',
    confirmed: 'Selection confirmed',
    declined: 'Selection declined',
  },
  button: 'send',
};

const handleConfirmationSubmit = (values, dispatch, props) => {
  const body = JSON.parse(values.confirmation)
    ? { did_accept: true, did_decline: false }
    : { did_accept: false, did_decline: true };
  props.submitConfirmation(body);
};

const showForm = (accepted, declined, classes, handleSubmit) => {
  if (accepted) {
    return (
      <div className={classes.iconWithText}>
        <Typography>
          {messages.labels.confirmed}
        </Typography>
        <CheckCircle className={classes.checked} />
      </div>);
  } else if (declined) {
    return (
      <div className={classes.iconWithText}>
        <Typography>{messages.labels.declined}</Typography>
        <RemoveCircle className={classes.declined} />
      </div>);
  }
  return (
    <div>
      <Typography>{messages.labels.chosenQuestion}</Typography>
      <ResultRadio />
      <Grid container justify="flex-end">
        <Grid item>
          <Button
            onClick={handleSubmit}
            color="accent"
          >
            {messages.button}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const ResultForm = (props) => {
  const { classes, handleSubmit, accepted, declined, displayActions, hasPermission } = props;
  return (
    <form onSubmit={handleSubmit}>
      <PaddedContent>
        <TextFieldForm
          fieldName="notifDate"
          label={messages.labels.notif}
          readOnly
        />
      </PaddedContent>
      {(hasPermission || accepted || declined) && <div className={classes.container}>
        <PaddedContent>
          <Typography>{messages.labels.chosen}</Typography>
          {showForm(accepted, declined, classes, handleSubmit, displayActions)}
        </PaddedContent>
      </div>}
    </form>);
};

ResultForm.propTypes = {
  classes: PropTypes.object,
  handleSubmit: PropTypes.func,
  accepted: PropTypes.bool,
  declined: PropTypes.bool,
  hasPermission: PropTypes.bool,
};

const formResult = reduxForm({
  form: 'confirmApplication',
})(ResultForm);

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    notifDate: ownProps.notifDate,
  },
  hasPermission: checkPermission(PARTNER_PERMISSIONS.CFEI_ANSWER_SELECTION, state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: handleConfirmationSubmit,
  submitConfirmation: body => dispatch(updateApplication(ownProps.application.id, body)),
  accepted: ownProps.application.did_accept,
  declined: ownProps.application.did_decline,
});


export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styleSheet, { name: 'ResultForm' })(formResult));
