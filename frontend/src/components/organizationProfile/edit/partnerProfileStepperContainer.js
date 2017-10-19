import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import { reduxForm, submit, FormSection, getFormSyncWarnings, getFormSubmitErrors, clearSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import PartnerProfileStepper from './partnerProfileStepper';
import Loader from '../../common/loader';
import {
  addIncompleteTab,
  removeIncompleteTab,
  addIncompleteStep,
  removeIncompleteStep } from '../../../reducers/partnerProfileEdit';

class PartnerProfileStepperContainer extends Component {
  constructor(props) {
    super(props);

    this.handleErrorClose = this.handleErrorClose.bind(this);
  }

  componentWillMount() {
    this.setState({ observedSteps: this.props.steps.map(step => step.name) });
  }

  componentWillUpdate(nextProps) {
    const { name, isTabWarning, noTabWarning, isStepWarning, noStepWarning } = this.props;

    if (!nextProps.warnings || !nextProps.warnings[name]) {
      noTabWarning(name);
      this.state.observedSteps.forEach(observedStep => noStepWarning(observedStep));
    } else {
      this.state.observedSteps.forEach((observedStep) => {
        if (!nextProps.warnings[name][observedStep]) {
          noStepWarning(observedStep);
        } else {
          isStepWarning(observedStep);
        }
      });
      isTabWarning(name);
    }
  }

  handleErrorClose() {
    const { clearError } = this.props;
    clearError();
  }

  render() {
    const { name, handleSubmit, readOnly, submitting, 
      steps, singleSection, last, error } = this.props;

    return (
      <div>
        <Loader loading={submitting}>
          <form onSubmit={handleSubmit}>
            <FormSection name={name}>
              <PartnerProfileStepper
                handleSubmit={handleSubmit}
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
          open={error}
          message={error}
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
  steps: PropTypes.arrayOf(PropTypes.objectOf({
    component: PropTypes.element,
    label: PropTypes.string,
    name: PropTypes.string,
  })),
  isTabWarning: PropTypes.func,
  noTabWarning: PropTypes.func,
  isStepWarning: PropTypes.func,
  noStepWarning: PropTypes.func,
  clearError: PropTypes.func,
  error: PropTypes.string,
  last: PropTypes.bool,
  submitting: PropTypes.bool,
  singleSection: PropTypes.bool,
  readOnly: PropTypes.bool,
};

const mapState = state => ({
  warnings: getFormSyncWarnings('partnerProfile')(state),
  error: getFormSubmitErrors('partnerProfile')(state),
  initialValues: state.partnerProfileDetails.partnerProfileDetails,
});

const mapDispatch = dispatch => ({
  isTabWarning: tabName => dispatch(addIncompleteTab(tabName)),
  noTabWarning: tabName => dispatch(removeIncompleteTab(tabName)),
  isStepWarning: stepName => dispatch(addIncompleteStep(stepName)),
  noStepWarning: stepName => dispatch(removeIncompleteStep(stepName)),
  submit: () => dispatch(submit('partnerProfile')),
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
