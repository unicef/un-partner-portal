import React from 'react';

import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';


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

const PartnerProfileMandatePopulation = () => (
  <FormSection name="populationOfConcern">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="popOfConcernWork"
            label="Does your organization work with populations of concern as defined by UNHCR"
            values={BOOL_VAL}
            optional
            warn
          />
        </Grid>
        <Grid item>
          <SelectForm
            fieldName="languages"
            label="Please indicate which group(s)"
            values={GROUP_VALUES}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileMandatePopulation;
