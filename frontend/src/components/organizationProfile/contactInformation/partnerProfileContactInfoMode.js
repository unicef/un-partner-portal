import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import SelectForm from '../../forms/selectForm';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const COMMUNICATION_VALUES = [
  {
    value: '1',
    label: 'Through the UNPP',
  },
  {
    value: '2',
    label: 'Email',
  },
  {
    value: '3',
    label: 'Telephone',
  },
  {
    value: '4',
    label: 'Letter',
  },
];

const PartnerProfileContactInfoMode = (props) => {
  const { classes } = props;
  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="communicationMode"
            label="What is your preferred mode of conversation?"
            values={COMMUNICATION_VALUES}
            onFieldChange={this.handleFieldChange}
            selectFieldProps={{
              multiple: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileContactInfoMode.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileContactInfoMode);
