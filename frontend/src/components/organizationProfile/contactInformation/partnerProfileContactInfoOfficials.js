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

const PartnerProfileContactInfoOfficials = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="hasBoD"
            label="Does your Organization have a Board of Directors?"
            values={BOOL_VAL}
            onFieldChange={this.handleBoDFieldChange}
          />
        </Grid>

        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="isAuthorisedOfficer"
                label="Authorised Officer?"
                values={BOOL_VAL}
                onFieldChange={this.handleAuthorisedOfficerFieldChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  );
};

PartnerProfileContactInfoOfficials.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileContactInfoOfficials);
