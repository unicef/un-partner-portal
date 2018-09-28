import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
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
import Declaration, { PLAIN_DECLRATIONS } from './declaration';
import Account from './account';
import AlertDialog from '../common/alertDialog';
import { loadCountries } from '../../reducers/countries';
import { registerUser } from '../../reducers/session';
import { loadPartnerConfig } from '../../reducers/partnerProfileConfig';

const messages = {
  error: 'Registration failed',
  declarationInfo: 'You must answer "yes" to all of the declarations in order to proceed.',
  warning: 'Notice',
  legalInfo: 'You must upload at least one of the following documents: (1) Registration certificate or (2) Governing document or (3) Letter of reference ' +  
  'from a donor agency, government authority or community association in order to register your organization on UN Partner Portal.',
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
    const formData = this.props.formData;

    if (!formData.partner_profile.have_governing_document
      && !formData.partner_profile.have_ref_letter
      && !(formData.partner_profile.registered_to_operate_in_country)) {
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
    let payload = R.assocPath(['json', 'declaration'],
      Object.keys(PLAIN_DECLRATIONS.questions).map((key, index) =>
        ({ answer: 'Yes', question: PLAIN_DECLRATIONS.questions[key] }),
      ), values);

    payload = R.dissoc('questions', payload);

    return this.props.registerUser(payload.json).catch((error) => {
      const errorMsg = R.path(['response', 'data', 'non_field_errors'], error) || messages.error;

      if (error.response.data.user) {
        this.setState({ stepIndex: 4 });
      } else if (error.response.data.partner_head_organization) {
        this.setState({ stepIndex: 1 });
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
          <Step>
            <StepLabel>Legal Status</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNextLegalStatus} handlePrev={this.handlePrev}>
                <LegalStatus />
              </RegistrationStep>
            </StepContent>
          </Step>
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
            <StepLabel>Terms of Use and Privacy Policy</StepLabel>
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
  formData: PropTypes.object,
  loadPartnerConfig: PropTypes.func,
  loadCountries: PropTypes.func,
  registerUser: PropTypes.func,
};

const selector = formValueSelector('registration');
const connectedRegistrationStepper = connect(
  state => ({
    answers: selector(state, 'questions'),
    formData: selector(state, 'json'),
  }),
  dispatch => ({
    loadCountries: () => dispatch(loadCountries()),
    loadPartnerConfig: () => dispatch(loadPartnerConfig()),
    registerUser: values => dispatch(registerUser(values)),
  }),
)(RegistrationStepper);

export default connectedRegistrationStepper;
