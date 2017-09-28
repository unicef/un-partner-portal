import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { reduxForm, FormSection, getFormSyncWarnings } from 'redux-form';
import { connect } from 'react-redux';
import PartnerProfileStepper from './partnerProfileStepper';
import { changeTabToNext,
  addIncompleteTab,
  removeIncompleteTab,
  addIncompleteStep,
  removeIncompleteStep } from '../../../reducers/partnerProfileEdit';

class PartnerProfileStepperContainer extends Component {
  componentWillMount() {
    this.setState({ observedSteps: this.props.steps.map(step => step.name) });
  }

  componentWillUpdate(nextProps) {
    const { name, isTabWarning, noTabWarning, isStepWarning, noStepWarning } = this.props;
    console.log('NAME', name);
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
    const { name, onNextClick, readOnly, steps, singleSection, last } = this.props;

    return (
      <form onSubmit={onNextClick}>
        <FormSection name={name}>
          <PartnerProfileStepper
            handleSubmit={onNextClick}
            steps={steps}
            last={last}
            readOnly={readOnly}
            singleSection={singleSection}
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
  singleSection: PropTypes.bool,
  readOnly: PropTypes.bool,
};

const mapState = state => ({
  warnings: getFormSyncWarnings('partnerProfile')(state),
  initialValues: state.partnerProfileDetails.partnerProfileDetails,
});

const mapDispatch = dispatch => ({
  isTabWarning: tabName => dispatch(addIncompleteTab(tabName)),
  noTabWarning: tabName => dispatch(removeIncompleteTab(tabName)),
  isStepWarning: stepName => dispatch(addIncompleteStep(stepName)),
  noStepWarning: stepName => dispatch(removeIncompleteStep(stepName)),
  onNextClick: () => dispatch(changeTabToNext()),
});

const connectedPartnerProfileRedux = reduxForm({
  form: 'partnerProfile', // a unique identifier for this form
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(PartnerProfileStepperContainer);

const connectedPartnerProfileStepper = connect(
  mapState,
  mapDispatch,
)(connectedPartnerProfileRedux);

export default withRouter(connectedPartnerProfileStepper);
