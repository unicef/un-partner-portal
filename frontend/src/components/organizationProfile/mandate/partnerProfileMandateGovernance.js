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

const PartnerProfileMandateGovernance = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <TextFieldForm
            label="Briefly describe the organization's governance structure"
            placeholder="Please limit your response to 200 characters"
            fieldName="structure"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Briefly describe the headquarters' oversight of country/branch office operations including anf reporting requirements of the country/branch offices to HQ"
            placeholder="Please limit your response to 200 characters"
            fieldName="oversight"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Your most up-to-date organigram"
            placeholder="Upload File"
            fieldName="organigram"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileMandateGovernance.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandateGovernance);
