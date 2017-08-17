import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
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

const PartnerProfileProjectImplementationManagement = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="approach"
            label="Do you use a results-based approach to managing programmes and projects?"
            values={BOOL_VAL}
            onFieldChange={this.handleApproachFieldChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please provide a brief description of your management approach"
            placeholder="200 character maximum"
            fieldName="approachDescription"
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
              <RadioForm
                fieldName="approach"
                label="Does your organization have a system for monitoring and evaluating its projects & programmes?"
                values={BOOL_VAL}
                onFieldChange={this.handleApproachFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Briefly explain your M&E system"
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
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="approach"
                label="Does the organization have systems or procedures in place for beneficaries to provide feedback on prject activities?"
                values={BOOL_VAL}
                onFieldChange={this.handleApproachFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Briefly explain your feedback mechanism"
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

PartnerProfileProjectImplementationManagement.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileProjectImplementationManagement);
