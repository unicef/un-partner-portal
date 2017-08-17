import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import TextFieldForm from '../../forms/textFieldForm';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const PartnerProfileMandateBackground = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <TextFieldForm
            label="Briefly state the background and rationale for the establishment of the organization"
            placeholder="Please limit your response to 400 characters"
            fieldName="background"
            textFieldProps={{
              inputProps: {
                maxLength: '400',
              },
            }}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Briefly state the mandate and mission of the organization"
            placeholder="Please limit your response to 400 characters"
            fieldName="mandate"
            textFieldProps={{
              inputProps: {
                maxLength: '400',
              },
            }}
          />
        </Grid>
      </Grid>
    </Grid>

  );
};

PartnerProfileMandateBackground.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandateBackground);
