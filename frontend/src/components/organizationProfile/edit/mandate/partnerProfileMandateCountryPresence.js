import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import SelectForm from '../../../forms/selectForm';


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

const PartnerProfileMandateCountryPresence = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="country_presence_hq">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <SelectForm
              fieldName="country_presents"
              label="Select the countries in which the organization operates"
              values={COUNTRY_MENU}
              selectFieldProps={{
                multiple: true,
              }}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <SelectForm
              fieldName="staff_globally"
              label="Total number of staff globally"
              values={COUNTRY_MENU}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};


PartnerProfileMandateCountryPresence.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateCountryPresence;
