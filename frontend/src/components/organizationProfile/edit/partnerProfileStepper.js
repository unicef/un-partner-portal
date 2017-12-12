import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { submit, FormSection, getFormSyncWarnings, getFormSubmitErrors, clearSubmitErrors } from 'redux-form';
import Button from 'material-ui/Button';
import ProfileStepContainer from './profileStepContainer';
import {
  Stepper,
} from '../../customStepper';

export const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 3;

  return {
    root: {
      maxWidth: '100%',
      padding: '1em 1em 3em',
    },
    buttonsMargin: {
      padding: `${padding}px 0 0 ${padding}px`,
    },
  };
};

const labels = {
  continue: 'SAVE & CONTINUE',
  exit: 'SAVE & EXIT',
};

class partnerProfileStepper extends Component {
  render() {
    const { classes, readOnly, handleSubmit, submitForm, handleNext, handleExit, singleSection, steps, last } = this.props;

    const sections = steps.map((item, index) => {
      const section = (
        <ProfileStepContainer key={item.name} item={item} index={index} singleSection={singleSection} />
      );
      return section;
    });

    return (
      <Grid container direction="column" className={classes.root} >
        <Stepper linear activeStep={0} orientation="vertical" allActive>
          {sections}
        </Stepper>

        {!readOnly ?
          <Grid item>
            <Grid className={classes.buttonsMargin} container direction="row" gutter={8}>
              {!last && <Grid item>
                <Button
                  color="accent"
                  raised
                  onTouchTap={() => { submitForm(); handleNext(); }}
                >
                  {labels.continue}
                </Button>
              </Grid>}
              <Grid item>
                <Button
                  raised={last}
                  onTouchTap={() => { submitForm(); handleExit(); }}
                >
                  {labels.exit}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          : null}
      </Grid>

    );
  }
}

partnerProfileStepper.propTypes = {
  classes: PropTypes.object,
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * callback for 'back' button
   */
  handleNext: PropTypes.func,
  handleExit: PropTypes.func,
  /**
   * component to be wrapped
   */
  steps: PropTypes.array,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.bool,
  /**
   * Read only mode
   */
  readOnly: PropTypes.bool,
  /**
   * Single section without label steps
   */
  singleSection: PropTypes.bool,
};


const mapState = (state, ownProps) => ({

});

const mapDispatch = dispatch => ({
  submitForm: () => dispatch(submit('partnerProfile')),
  dispatch,
});

const connectedpartnerProfileStepper = connect(mapState, mapDispatch)(partnerProfileStepper);

export default withStyles(styleSheet, { name: 'partnerProfileStepper' })(connectedpartnerProfileStepper);
