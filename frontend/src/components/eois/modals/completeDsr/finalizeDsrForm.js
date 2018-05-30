import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import GridRow from '../../../common/grid/gridRow';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import { selectNormalizedDsrFinalizeOptions,
  selectNormalizedTimePeriods,
  selectCfeiStatus,
  selectCfeiWinnersStatus,
} from '../../../../store';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../../../helpers/constants';

const styleSheet = theme => ({
  formControl: {
    marginLeft: theme.spacing.unit * 2,
  },
});


const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};

const mapCompletionReasons = (disableNoC, disablePar) => (item) => {
  if (item.value === 'NoC' && disableNoC) {
    return { disabled: true, ...item };
  } else if (item.value === 'Par' && disablePar) {
    return { disabled: true, ...item };
  }
  return item;
};

const CompleteCfeiForm = (props) => {
  const { classes, handleSubmit, completionReasons, timePeriods, completedReason } = props;
  const completedReasonAccepted = [];
  const completedReasonRetention = [];
  const completedReasonCancelled = [];
  const checkIfRetention = completedReason !== 'accepted_retention';
  const checkIfCancelled = completedReason !== 'cancelled';

  const formControlStyle = {
    marginLeft: '20px',
    paddingRight: '20px',
  };
  completedReasonAccepted.push(completionReasons[1]);
  completedReasonRetention.push(completionReasons[2]);
  completedReasonCancelled.push(completionReasons[0]);
  return (
    <form onSubmit={handleSubmit}>

      <RadioForm
        label="lalala"
        fieldName="completed_reason"
        values={completedReasonAccepted}
        column
      />
      <RadioForm
        fieldName="completed_reason"
        values={completedReasonRetention}
        column
      />
      <GridRow>
        <Grid>
          <SelectForm
            fieldName="retention"
            placeholder="Select time period"
            label="Time period"
            values={timePeriods}
            // readOnly={completedReason !== 'accepted_retention'}
            selectFieldProps={{
              disabled: checkIfRetention,
            }}
            formControlStyle={formControlStyle}
          />
        </Grid>
        <Grid />
      </GridRow>
      <RadioForm
        fieldName="completed_reason"
        values={completedReasonCancelled}
        column
      />
      <TextFieldForm
        fieldName="cancellation"
        placeholder="Add explanation for cancellation"
        label="Explanation for cancellation"
        textFieldProps={{
          disabled: checkIfCancelled,
        }}
        formControlStyle={formControlStyle}
        // readOnly={completedReason !== 'cancelled'}
        // style={{ marginLeft: '30px' }}
      />
    </form >
  );
};

CompleteCfeiForm.propTypes = {
  classes: PropTypes.object,
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  completionReasons: PropTypes.array,
  timePeriods: PropTypes.array,
  disabled: PropTypes.string,
};

const formEditCfei = reduxForm({
  form: 'completeCfei',
})(CompleteCfeiForm);

const mapStateToProps = (state, { params: { id, type } }, ownProps) => {
  const completionReasons = selectNormalizedDsrFinalizeOptions(state);
  const status = selectCfeiStatus(state, id);
  const reviewStarted = (status === PROJECT_STATUSES.OPE && type !== PROJECT_TYPES.DIRECT);
  const hasWinners = selectCfeiWinnersStatus(state, id);
  const selector = formValueSelector('completeCfei');
  return {
    completionReasons: completionReasons.map(
      mapCompletionReasons(reviewStarted, !hasWinners)),
    timePeriods: selectNormalizedTimePeriods(state),
    completedReason: selector(state, 'completed_reason'),
  };
};

export default compose(
  withStyles(styleSheet, { name: 'CompleteCfeiForm' }),
  withRouter,
  connect(mapStateToProps),
)(formEditCfei);
