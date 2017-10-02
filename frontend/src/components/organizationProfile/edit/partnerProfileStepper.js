import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
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
    const { classes, readOnly, handleSubmit, handlePrev, singleSection, steps, last } = this.props;

    const sections = steps.map((item, index) => {
      const section = (
        <ProfileStepContainer item={item} index={index} singleSection={singleSection} />
      );
      return section;
    });

    return (
      <Grid container direction="column" xs={12} className={classes.root} >
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
                  onTouchTap={handleSubmit}
                >
                  {labels.continue}
                </Button>
              </Grid>}
              <Grid item>
                <Button
                  raised={last}
                  onTouchTap={handlePrev}
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
  handlePrev: PropTypes.func,
  /**
   * component to be wrapped
   */
  steps: PropTypes.element.isRequired,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.boolean,
  /**
   * Read only mode
   */
  readOnly: PropTypes.bool,
  /**
   * Single section without label steps
   */
  singleSection: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'partnerProfileStepper' })(partnerProfileStepper);
