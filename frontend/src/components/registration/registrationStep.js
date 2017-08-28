import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';


const messages = {
  continue: 'Continue',
  register: 'Register',
  cancel: 'Cancel',
};

const RegistrationStep = (props) => {
  const { handleSubmit, handlePrev, last, first, children, reset } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" xs={12} >
        {React.Children.map(children, child =>
          React.cloneElement(child, { reset }),
        )}
        <Grid item>
          <Grid container direction="row" gutter={8}>
            <Grid item>
              <Button
                color="accent"
                raised
                onTouchTap={handleSubmit}
              >
                {(last) ? messages.register : messages.continue}
              </Button>
            </Grid>
            <Grid item>
              {(!first && <Button
                onTouchTap={handlePrev}
              >
                {messages.cancel}
              </Button>)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form >
  );
};

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
  first: PropTypes.bool,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.bool,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegistrationStep);
