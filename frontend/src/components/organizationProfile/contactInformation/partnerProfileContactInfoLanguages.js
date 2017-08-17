import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

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
    label: 'French',
  },
  {
    value: 'it',
    label: 'Italian',
  },
];

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

const PartnerProfileContactInfoLanguages = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="row">
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="languages"
            label="Working Language(s) of your Organization"
            values={COUNTRY_MENU}
            onFieldChange={this.handleLanguagesFieldChange}
            selectFieldProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please State"
            placeholder="Additional languages known"
            fieldName="extraLanguage"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileContactInfoLanguages.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileContactInfoLanguages);
