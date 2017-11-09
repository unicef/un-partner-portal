import React from 'react';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';

const messages = {
  continue: 'Continue',
  register: 'Register',
  cancel: 'Cancel',
};

const RegistrationStep = (props) => {
  const { handleSubmit, handlePrev, last, first, children, reset, error, clearError } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" >
        {React.Children.map(children, child =>
          React.cloneElement(child, { reset }),
        )}
        <Grid item xs={12}>
          <Grid container direction="row" spacing={8}>
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={error}
        message={error}
        autoHideDuration={6e3}
        onRequestClose={clearError}
      />
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
  error: PropTypes.string,
  clearError: PropTypes.object,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clearError: () => dispatch(clearSubmitErrors(ownProps.form)),
});

const connectedRegistrationStep = connect(
  null,
  mapDispatchToProps,
)(RegistrationStep);

export default reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(connectedRegistrationStep);
