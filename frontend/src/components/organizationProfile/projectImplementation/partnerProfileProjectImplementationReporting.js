import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';

const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const PartnerProfileProjectImplementationReporting = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Briefly explain the key results achieved by your organization over the last year"
            placeholder="200 character maximum"
            fieldName="achievements"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <SelectForm
                fieldName="annualReports"
                label="Does the organization publish annual reports?"
                values={BOOL_VAL}
                onFieldChange={this.handleAnnualReportsFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Date of most recent annual report"
                placeholder="DD/MM/YYYY"
                fieldName="date"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Copy of your most rescent audit report"
                placeholder="UPLOAD FILE"
                fieldName="date"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Or insert the link to the report form the organization's website"
                placeholder="200 character maximum"
                fieldName="approachDescription"
                textFieldProps={{
                  inputProps: {
                    maxLength: '200',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileProjectImplementationReporting.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileProjectImplementationReporting);
