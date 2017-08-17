import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import TextFieldForm from '../../forms/textFieldForm';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

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

const PartnerProfileMandateSecurity = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hasAbuseSafeguard"
                label="Does the organization have a policy or code of conduct to safegaurd against the violation and abuse of beneficiaries?"
                values={BOOL_VAL}
                onFieldChange={this.handleAbuseSafeguardFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hasAbuseSafeguard"
                label="Does the organization have a policy or code of conduct to safegaurd against the violation and abuse of beneficiaries?"
                values={BOOL_VAL}
                onFieldChange={this.handleAbuseSafeguardFieldChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please comment"
            placeholder=""
            fieldName="fraudSafeguardComment"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileMandateSecurity.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandateSecurity);
