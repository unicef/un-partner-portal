import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { browserHistory as history } from 'react-router';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import PropTypes from 'prop-types';

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
import { getCountries } from '../../helpers/api/api';
import {loadCountries} from '../../reducers/countries';

const styleSheet = createStyleSheet('RegistrationStepper', () => ({
  root: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));


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

  componentWillMount() {
    loadCountries(this.props.dispatch);
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  }

  handleNextQuestions() {
    const answers = this.props.answers;
    if (answers && answers.some(answer => answer === 'false')) {
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
    history.push('/');
  }


  render() {
    const { classes } = this.props;
    const { stepIndex } = this.state;
    return (
      <div className={classes.root}>
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
RegistrationStepper.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
  /**
   * answers to all questions in declaration component, show dialog when at least one is false
   */
  answers: PropTypes.arrayOf(PropTypes.string),
};

const selector = formValueSelector('registration');
const connectedRegistrationStepper = connect(
  state => ({
    answers: selector(state, 'questions'),
  }),
)(RegistrationStepper);

export default withStyles(styleSheet)(connectedRegistrationStepper);
