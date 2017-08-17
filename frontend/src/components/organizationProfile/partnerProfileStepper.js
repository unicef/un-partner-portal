import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper';
import validate from './partnerProfileValidation';

class partnerProfileStep extends Component {
  render() {
    const { handleSubmit, handlePrev, last, first, steps } = this.props;
    const sections = steps.map((item) => {
      const section = (
        <Step>
          <StepLabel>{item.label}</StepLabel>
          <StepContent>
            {item.component}
          </StepContent>
        </Step>
      );
      return section;
    });

    return (
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" xs={12} >
          <Stepper linear activeStep={0} orientation="vertical" allActive>
            {sections}
          </Stepper>
          <Grid item>
            <Grid container direction="row" spacing={8}>
              <Grid item>
                <Button
                  color="accent"
                  raised
                  onTouchTap={handleSubmit}
                >
                  {(last) ? 'Submit' : 'SAVE & CONTINUE'}
                </Button>
              </Grid>
              <Grid item>
                {(!first && <Button
                  onTouchTap={handlePrev}
                >
                  {'SAVE & EXIT'}
                </Button>)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form >
    );
  }
}

partnerProfileStep.propTypes = {
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * callback for 'back' button
   */
  handlePrev: PropTypes.func,
  /**
   * component to be wrapped
   */
  steps: PropTypes.node.isRequired,
  /**
   * whether step is the first, to control buttons appearance
   */
  first: PropTypes.boolean,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.boolean,
};

export default reduxForm({
  form: 'partnerProfile', // a unique identifier for this form
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(partnerProfileStep);
