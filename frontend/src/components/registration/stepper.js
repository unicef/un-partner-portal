import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper';
import LegalStatus from './legalStatus';
import OrganizationType from './organizationType';
import BasicInformation from './basicInformation';
import RegistrationStep from './registrationStep';
import Declaration from './declaration';
import Account from './account';
import AlertDialog from '../common/alertDialog';
import { loadCountries } from '../../reducers/countries';
import { registerUser } from '../../reducers/session';
import { loadPartnerConfig } from '../../reducers/partnerProfileConfig';

const messages = {
  error: 'Registration failed',
  declarationInfo: 'You answered no to at least one of the questions, cannot proceed',
  warning: 'Warning',
  legalInfo: 'You have to upload at least one of Registration, Governing documents or letter of reference to proceed registration process',
};

class RegistrationStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      lastStep: 4,
      declarationAlert: false,
      legalStatusAlert: false,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleNextQuestions = this.handleNextQuestions.bind(this);
    this.handleNextLegalStatus = this.handleNextLegalStatus.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.loadCountries();
    this.props.loadPartnerConfig();
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  }

  handleNextQuestions() {
    const answers = this.props.answers;
    if (answers && answers.some(answer => answer === false)) {
      this.setState({ declarationAlert: true });
      return;
    }
    this.handleNext();
  }

  handleNextLegalStatus() {
    const legalStatusData = this.props.legalStatusData;

    if (!legalStatusData.have_gov_doc
      || !legalStatusData.have_ref_letter
      || !legalStatusData.have_registration_doc) {
      this.setState({ legalStatusAlert: true });
      return;
    }

    this.handleNext();
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  handleSubmit(values) {
    return this.props.registerUser(values.json).catch((error) => {
      const errorMsg = path(['response', 'data', 'non_field_errors'], error) || messages.error;
      if (error.response.data.user) {
        this.setState({ stepIndex: 3 });
      }
      throw new SubmissionError({
        json: { ...error.response.data },
        _error: errorMsg,
      });
    });
  }

  render() {
    const { stepIndex } = this.state;
    return (
      <div>
        <Stepper linear activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Select type of organization</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} first>
                <OrganizationType />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Enter basic identification information</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <BasicInformation />
              </RegistrationStep>
            </StepContent>
          </Step>
          {/* <Step>
            <StepLabel>Legal Status</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNextLegalStatus} handlePrev={this.handlePrev}>
                <LegalStatus />
              </RegistrationStep>
            </StepContent>
          </Step> */}
          <Step>
            <StepLabel>Partner Declaration</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNextQuestions} handlePrev={this.handlePrev}>
                <Declaration />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Provide e-mail and create password</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <Account />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Complete the process</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleSubmit} handlePrev={this.handlePrev} last />
            </StepContent>
          </Step>
        </Stepper>
        <AlertDialog
          trigger={!!this.state.declarationAlert}
          title={messages.warning}
          text={messages.declarationInfo}
          handleDialogClose={() => this.setState({ declarationAlert: false })}
        />
        <AlertDialog
          trigger={!!this.state.legalStatusAlert}
          title={messages.warning}
          text={messages.legalInfo}
          handleDialogClose={() => this.setState({ legalStatusAlert: false })}
        />
      </div>
    );
  }
}
RegistrationStepper.propTypes = {
  /**
   * answers to all questions in declaration component, show dialog when at least one is false
   */
  answers: PropTypes.arrayOf(PropTypes.bool),
  legalStatusData: PropTypes.object,
  loadPartnerConfig: PropTypes.func,
  loadCountries: PropTypes.func,
  registerUser: PropTypes.func,
};

const selector = formValueSelector('registration');
const connectedRegistrationStepper = connect(
  state => ({
    answers: selector(state, 'questions'),
    legalStatusData: selector(state, 'json.legal'),
  }),
  dispatch => ({
    loadCountries: () => dispatch(loadCountries()),
    loadPartnerConfig: () => dispatch(loadPartnerConfig()),
    registerUser: values => dispatch(registerUser(values)),
  }),
)(RegistrationStepper);

export default connectedRegistrationStepper;
