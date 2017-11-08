import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import PaddedContent from '../../../../common/paddedContent';
import { updateApplication } from '../../../../../reducers/partnerApplicationDetails';
import ResultRadio from './resultRadio';
import ProfileConfirmation from '../../../../organizationProfile/common/profileConfirmation';
import { PROJECT_STATUSES } from '../../../../../helpers/constants';
import { formatDateForPrint } from '../../../../../helpers/dates';

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
  change: 'You can change your decision until...',
  confirm: 'You were direclty selected. Confirm your participation:',
  confirmed: 'Selection confirmed',
  declined: 'Selection declined',
  button: 'send',
  buttonChange: 'change',
  ended: 'This project is already closed/completed',
  decision: 'Decision sent',
};


const button = (handleClick, disabled, message) => (
  <Grid container justify="flex-end">
    <Grid item>
      <Button
        onClick={handleClick}
        color="accent"
        disabled={disabled}
      >
        {message}
      </Button>
    </Grid>
  </Grid>
);


class ResultForm extends Component {
  constructor() {
    super();
    this.state = {
      confirmed: false,
      change: false,
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleDecisionChange = this.handleDecisionChange.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  handleConfirmationSubmit(values) {
    const body = JSON.parse(values.confirmation)
      ? { did_accept: true, did_decline: false }
      : { did_accept: false, did_decline: true };
    this.props.submitConfirmation(body);
    this.setState({ change: false, confirmed: false });
  }

  handleCheckChange() {
    this.setState({ confirmed: !this.state.confirmed });
  }

  handleDecisionChange() {
    this.setState({ change: true });
  }

  baseForm() {
    const { handleSubmit } = this.props;
    const { confirmed } = this.state;
    return (<div>
      <ResultRadio />
      <ProfileConfirmation onChange={this.handleCheckChange} />
      {button(handleSubmit(this.handleConfirmationSubmit), !confirmed, messages.button)}
    </div>);
  }

  showForm() {
    const { accepted, declined, status, decisionDate } = this.props;
    const { change } = this.state;
    if (accepted) {
      return (<div>
        <Typography>{messages.confirmed}</Typography>
        <Typography type="caption">{`${messages.decision}: ${decisionDate}`}</Typography>
        {change
          ? this.baseForm()
          : button(this.handleDecisionChange,
            status !== PROJECT_STATUSES.OPE,
            messages.buttonChange)}
      </div>);
    } else if (declined) {
      return (<div>
        <Typography>{messages.declined}</Typography>
        <Typography type="caption">{`${messages.decision}: ${decisionDate}`}</Typography>
        {change
          ? this.baseForm()
          : button(this.handleDecisionChange,
            status !== PROJECT_STATUSES.OPE,
            messages.buttonChange)}
      </div>);
    } else if (status !== PROJECT_STATUSES.OPE) {
      return <Typography>{messages.ended}</Typography>;
    }
    return (
      <div>
        <Typography>{messages.confirm}</Typography>
        <Typography type="caption">{messages.change}</Typography>
        {this.baseForm()}
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleConfirmationSubmit)}>
        <PaddedContent>
          {this.showForm()}
        </PaddedContent>
      </form>);
  }
}

ResultForm.propTypes = {
  handleSubmit: PropTypes.func,
  accepted: PropTypes.bool,
  declined: PropTypes.bool,
  submitConfirmation: PropTypes.func,
  status: PropTypes.string,
  decisionDate: PropTypes.string,
};

const formResult = reduxForm({
  form: 'confirmApplication',
})(ResultForm);

const mapStateToProps = (state, ownProps) => ({
  accepted: ownProps.application.did_accept,
  declined: ownProps.application.did_decline,
  decisionDate: formatDateForPrint(ownProps.application.decision_date),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  submitConfirmation: body => dispatch(updateApplication(ownProps.application.id, body)),
});


export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styleSheet, { name: 'ResultForm' })(formResult));
