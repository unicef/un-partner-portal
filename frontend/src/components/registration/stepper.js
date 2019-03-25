import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, SubmissionError } from 'redux-form';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
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
  duplication: 'Duplicate registration detected. An entity sharing your organization’s name and other vital details is already registered in the UN Partner Portal:',
  duplicationPart_2: 'Please consult within your organization or contact the UN Partner Portal Help Desk.',
  userEmail: 'User e-mail:',
  headOfOrgEmail: 'Head of Organization e-mail:',
};

class RegistrationStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      lastStep: 4,
      duplicationFields: '',
      errorAlert: false,
      declarationAlert: false,
      legalStatusAlert: false,
      duplicationAlert: false,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleNextQuestions = this.handleNextQuestions.bind(this);
    this.handleNextLegalStatus = this.handleNextLegalStatus.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const token = window.localStorage.token;
    if (!token) {
      history.push('/login');
    }

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
    const { userEmail, headOfOrgEmail } = this.props;

    let payload = R.assocPath(['json', 'declaration'],
      Object.keys(PLAIN_DECLRATIONS.questions).map((key, index) =>
        ({ answer: 'Yes', question: PLAIN_DECLRATIONS.questions[key] }),
      ), values);

    payload = R.dissoc('questions', payload);

    return this.props.registerUser(payload.json)
      .catch((error) => {
        const errorMsg = R.path(['response', 'data', 'non_field_errors'], error) || messages.error;
        const data = R.path(['response', 'data'], error).detail || R.path(['response', 'data'], error)
          || R.path(['response', 'data', 'non_field_errors'], error) || messages.error;

        if (data && data.partner_head_organization) {
          this.setState({ stepIndex: 1, duplicationAlert: true, duplicationFields: `${messages.headOfOrgEmail} ${headOfOrgEmail}` });
        } else {
          this.setState({ stepIndex: 1, errorAlert: true, error: data });
        }

        throw new SubmissionError({
          json: data,
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
            <StepLabel>Terms of Use and Privacy Policy</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleSubmit} handlePrev={this.handlePrev} last />
            </StepContent>
          </Step>
        </Stepper>
        <AlertDialog
          trigger={!!this.state.errorAlert}
          title={messages.warning}
          text={this.state.error}
          handleDialogClose={() => this.setState({ errorAlert: false })}
        />
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
        <AlertDialog
          trigger={!!this.state.duplicationAlert}
          title={messages.warning}
          text={<Typography style={{ whiteSpace: 'pre-line' }} type="body1">{`${messages.duplication} \n\n ${this.state.duplicationFields} \n\n ${messages.duplicationPart_2}`}</Typography>}
          handleDialogClose={() => this.setState({ duplicationAlert: false })}
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
  userEmail: PropTypes.string,
  headOfOrgEmail: PropTypes.string,
};

const selector = formValueSelector('registration');
const connectedRegistrationStepper = connect(
  state => ({
    answers: selector(state, 'questions'),
    userEmail: selector(state, 'json.user.email'),
    headOfOrgEmail: selector(state, 'json.partner_head_organization.email'),
    formData: selector(state, 'json'),
  }),
  dispatch => ({
    loadCountries: () => dispatch(loadCountries()),
    loadPartnerConfig: () => dispatch(loadPartnerConfig()),
    registerUser: values => dispatch(registerUser(values)),
  }),
)(RegistrationStepper);

export default connectedRegistrationStepper;
