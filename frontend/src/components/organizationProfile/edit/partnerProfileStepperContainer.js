import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import { reduxForm, submit, FormSection, getFormSyncWarnings, getFormSubmitErrors, clearSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import PartnerProfileStepper from './partnerProfileStepper';
import Loader from '../../common/loader';
import { addIncompleteStep, removeIncompleteStep } from '../../../reducers/partnerProfileEdit';

class PartnerProfileStepperContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      observedSteps: props.steps.map(step => step.name),
    };
    this.handleErrorClose = this.handleErrorClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { name, isStepWarning, noStepWarning } = this.props;

    if (!nextProps.warnings || !nextProps.warnings[name]) {
      this.state.observedSteps.forEach(observedStep => noStepWarning(observedStep));
    } else {
      this.state.observedSteps.forEach((observedStep) => {
        if (!nextProps.warnings[name][observedStep]) {
          noStepWarning(observedStep);
        } else {
          isStepWarning(observedStep);
        }
      });
    }
  }

  handleErrorClose() {
    const { clearError } = this.props;
    clearError();
  }

  render() {
    const { name, handleSubmit, readOnly, submitting,
      steps, singleSection, last, error, handleExit, handleNext } = this.props;

    return (
      <div>
        <Loader loading={submitting}>
          <form onSubmit={handleSubmit}>
            <FormSection name={name}>
              <PartnerProfileStepper
                handleSubmit={handleSubmit}
                handleNext={handleNext}
                handleExit={handleExit}
                steps={steps}
                last={last}
                readOnly={readOnly}
                singleSection={singleSection}
              />
            </FormSection>
          </form>
        </Loader>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!!error}
          message={error || []}
          autoHideDuration={6e3}
          onRequestClose={this.handleErrorClose}
        />
      </div>
    );
  }
}

PartnerProfileStepperContainer.propTypes = {
  name: PropTypes.string,
  handleSubmit: PropTypes.func,
  steps: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    label: PropTypes.string,
    name: PropTypes.string,
  })),
  isStepWarning: PropTypes.func,
  noStepWarning: PropTypes.func,
  clearError: PropTypes.func,
  error: PropTypes.array,
  last: PropTypes.bool,
  submitting: PropTypes.bool,
  handleNext: PropTypes.func,
  handleExit: PropTypes.func,
  singleSection: PropTypes.bool,
  readOnly: PropTypes.bool,
};

const mapState = state => ({
  warnings: getFormSyncWarnings('partnerProfile')(state),
  error: getFormSubmitErrors('partnerProfile')(state),
  initialValues: state.partnerProfileDetails.partnerProfileDetails,
});

const mapDispatch = dispatch => ({
  isStepWarning: stepName => dispatch(addIncompleteStep(stepName)),
  noStepWarning: stepName => dispatch(removeIncompleteStep(stepName)),
  clearError: () => dispatch(clearSubmitErrors('partnerProfile')),
});

const connectedPartnerProfileRedux = reduxForm({
  form: 'partnerProfile', // a unique identifier for this form
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(PartnerProfileStepperContainer);

const connectedPartnerProfileStepper = connect(
  mapState,
  mapDispatch,
)(connectedPartnerProfileRedux);

export default withRouter(connectedPartnerProfileStepper);
