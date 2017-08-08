import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import Grid from 'material-ui/Grid';


import Button from 'material-ui/Button';

import validate from './registrationValidation'

class RegistrationStep extends Component {

  render() {
    const { handleSubmit, handlePrev, last, first, children } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Grid container direction='column' xs={12} >
          { children }
          <Grid item>
            <Grid container direction='row' spacing={8}>
              <Grid item>
                <Button
                  color='accent'
                  raised={true}
                  onTouchTap={handleSubmit}>
                  {(last) ? 'Submit' : 'Continue'}
                </Button>
              </Grid>
              <Grid item>
                {(!first && <Button
                  onTouchTap={handlePrev}>
                  {'Cancel'}
                </Button>)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form >
    )
  }
}

export default reduxForm({
  form: 'registration',  // a unique identifier for this form
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(RegistrationStep);