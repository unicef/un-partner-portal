import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';

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

const GROUP_VALUES = [
  {
    value: '1',
    label: 'Refugees',
  },
  {
    value: '2',
    label: 'Asylum Seekers',
  },
  {
    value: '3',
    label: 'Stateless',
  },
  {
    value: '4',
    label: 'Orphans',
  },
];

const PartnerProfileMandatePopulation = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="popOfConcernWork"
            label="Does your organization work with populations of concern as defined by UNHCR"
            values={BOOL_VAL}
            onFieldChange={this.handleConcernFieldChange}
          />
        </Grid>
        <Grid item>
          <SelectForm
            fieldName="languages"
            label="Please indicate which group(s)"
            values={GROUP_VALUES}
            onFieldChange={this.handleGroupFieldChange}
            selectFieldProps={{
              multiple: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileMandatePopulation.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandatePopulation);
