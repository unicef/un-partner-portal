import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { reduxForm, FormSection, getFormSyncWarnings } from 'redux-form';
import { connect } from 'react-redux';
import { loadPartnerDetails } from '../../../reducers/partnerProfileDetails';
import PartnerProfileStepper from './partnerProfileStepper';
import { changeTabToNext,
  addIncompleteTab,
  removeIncompleteTab,
  addIncompleteStep,
  removeIncompleteStep } from '../../../reducers/partnerProfileEdit';

class PartnerProfileStepperContainer extends Component {
  componentWillMount() {
    this.setState({ observedSteps: this.props.steps.map(step => step.name) });

    this.props.loadPartnerProfileDetails();
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

  render() {
    const { name, onNextClick, readOnly, steps, last } = this.props;

    return (
      <form onSubmit={onNextClick}>
        <FormSection name={name}>
          <PartnerProfileStepper
            handleSubmit={onNextClick}
            steps={steps}
            last={last}
            readOnly={readOnly}
          />
        </FormSection>
      </form>
    );
  }
}

PartnerProfileStepperContainer.propTypes = {
  name: PropTypes.string,
  onNextClick: PropTypes.func,
  steps: PropTypes.arrayOf(PropTypes.objectOf({
    component: PropTypes.element,
    label: PropTypes.string,
    name: PropTypes.string,
  })),
  isTabWarning: PropTypes.func,
  noTabWarning: PropTypes.func,
  isStepWarning: PropTypes.func,
  noStepWarning: PropTypes.func,
  last: PropTypes.bool,
  readOnly: PropTypes.bool,
  loadPartnerProfileDetails: PropTypes.func,
};

const mapState = state => ({
  warnings: getFormSyncWarnings('PartnerProfileStepperContainer')(state),
});

const mapDispatch = (dispatch, ownProps) => {
  const { countryCode } = ownProps.params;

  return {
    isTabWarning: tabName => dispatch(addIncompleteTab(tabName)),
    noTabWarning: tabName => dispatch(removeIncompleteTab(tabName)),
    isStepWarning: stepName => dispatch(addIncompleteStep(stepName)),
    noStepWarning: stepName => dispatch(removeIncompleteStep(stepName)),
    onNextClick: () => dispatch(changeTabToNext()),
    loadPartnerProfileDetails: () => dispatch(loadPartnerDetails(countryCode)),
  };
};


const connectedPartnerProfileStepper = connect(
  mapState,
  mapDispatch,
)(PartnerProfileStepperContainer);

const connectedPartnerProfileRouter = withRouter(connectedPartnerProfileStepper);

export default reduxForm({
  form: 'partnerProfile', // a unique identifier for this form
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(connectedPartnerProfileRouter);

