import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';

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

const PartnerProfileIdentificationBasicInfo = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="basic">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <TextFieldForm
            label="Organization's Legal Name"
            fieldName="legal_name"
            optional
            warn
            readOnly={readOnly}
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Alias (if applicable)"
              fieldName="alias_name"
              placeholder="Provide alias"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Acronym (if applicable)"
              fieldName="acronym"
              placeholder="Provide acronym"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Organization's former Legal Name"
              fieldName="formerName"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <SelectForm
            fieldName="country_code"
            label="Country of Origin"
            values={COUNTRY_MENU}
            optional
            warn
            readOnly={readOnly}
          />
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName="display_type"
              label="Type of organization"
              values={ORG_VALUES}
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

PartnerProfileIdentificationBasicInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileIdentificationBasicInfo;

