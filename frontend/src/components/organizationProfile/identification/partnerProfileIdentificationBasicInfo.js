import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France',
  },
  {
    value: 'it',
    label: 'Italy',
  },
];

const ORG_VALUES = [
  {
    value: 'ngo',
    label: 'National NGO',
  },
  {
    value: 'ingo',
    label: 'International NGO (INGO)',
  },
];

const STAFF_VALUES = [
  {
    value: '1',
    label: '1-10',
  },
  {
    value: '2',
    label: '11-50',
  },
  {
    value: '3',
    label: '51-100',
  },
  {
    value: '4',
    label: '101-200',
  },
];

const PartnerProfileIdentificationBasicInfo = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <TextFieldForm
          label="Organization's Legal Name"
          fieldName="legalName"
        />
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Alias (if applicable)"
            fieldName="legalNameAlias"
            optional
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Acronym (if applicable)"
            fieldName="acronym"
            optional
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Organization's former Legal Name"
            fieldName="formerNAme"
          />
        </Grid>
        <SelectForm
          fieldName="country"
          label="Country of Origin"
          values={COUNTRY_MENU}
        />
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="organizationType"
            label="Type of organization"
            values={ORG_VALUES}
            onFieldChange={this.handleOrgFieldChange}
            infoIcon
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileIdentificationBasicInfo.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileIdentificationBasicInfo);
