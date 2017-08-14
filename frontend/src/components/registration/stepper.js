import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper';
import OrganizationType from './organizationType';
import BasicInformation from './basicInformation';
import RegistrationStep from './registrationStep';
import Declaration from './declaration';
import Account from './account';
import AlertDialog from '../common/alertDialog';


class RegistrationStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      lastStep: 4,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleNextQuestions = this.handleNextQuestions.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
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

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  handleSubmit(values) {
    alert(JSON.stringify(values, null, 4));
  }


  render() {
    const { stepIndex } = this.state;
    return (
      <div style={{ maxWidth: '100%', padding: '1em 1em 3em' }}>
        <Stepper linear activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Select type of your organization</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} first>
                <OrganizationType />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Enter basic information</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <BasicInformation />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Fill the Harmonized Due Dilligence Declaration</StepLabel>
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
          trigger={this.state.declarationAlert}
          title="Warning"
          text="You answered no to at least one of the questions, cannot proceed"
          handleDialogClose={() => this.setState({ declarationAlert: false })}
        />
      </div>
    );
  }
}

const selector = formValueSelector('registration');
const connectedRegistrationStepper = connect(
  state => ({
    answers: selector(state, 'questions'),
  }),
)(RegistrationStepper);

export default withStyles()(connectedRegistrationStepper);
