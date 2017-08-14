import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';


import Button from 'material-ui/Button';

import validate from './registrationValidation';

function RegistrationStep(props) {
  const { handleSubmit, handlePrev, last, first, children, reset } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" xs={12} >
        {React.Children.map(children, child =>
          React.cloneElement(child, { reset }),
        )}
        <Grid item>
          <Grid container direction="row" spacing={8}>
            <Grid item>
              <Button
                color="accent"
                raised
                onTouchTap={handleSubmit}
              >
                {(last) ? 'Register' : 'Continue'}
              </Button>
            </Grid>
            <Grid item>
              {(!first && <Button
                onTouchTap={handlePrev}
              >
                {'Cancel'}
              </Button>)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form >
  );
}

RegistrationStep.propTypes = {
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
  children: PropTypes.node.isRequired,
  /**
   * whether step is the first, to control buttons appearance
   */
  first: PropTypes.boolean,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.boolean,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'registration', // a unique identifier for this form
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(RegistrationStep);
