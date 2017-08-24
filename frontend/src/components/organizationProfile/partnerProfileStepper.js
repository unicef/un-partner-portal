import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import ProfileStepContainer from './profileStepContainer';
import {
  Stepper,
} from '../customStepper';

export const styleSheet = createStyleSheet('MuiStepper', () => ({
  root: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

class partnerProfileStepper extends Component {
  render() {
    const { classes, handleSubmit, handlePrev, steps, last } = this.props;
    const sections = steps.map((item, index) => {
      const section = (
        <ProfileStepContainer item={item} index={index} />
      );
      return section;
    });

    return (
      <Grid container direction="column" xs={12} className={classes.root} >
        <Stepper linear activeStep={0} orientation="vertical" allActive>
          {sections}
        </Stepper>
        <Grid item>
          <Grid container direction="row" gutter={8}>
            {!last && <Grid item>
              <Button
                color="accent"
                raised
                onTouchTap={handleSubmit}
              >
                {'SAVE & CONTINUE'}
              </Button>
            </Grid>}
            <Grid item>
              <Button
                raised={last}
                onTouchTap={handlePrev}
              >
                {'SAVE & EXIT'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
  steps: PropTypes.node.isRequired,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.boolean,
};

export default withStyles(styleSheet)(partnerProfileStepper);
