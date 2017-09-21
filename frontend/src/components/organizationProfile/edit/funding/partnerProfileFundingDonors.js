import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';

const DONORS_MENU = [
  {
    value: '1',
    label: 'Individuals',
  },
  {
    value: '2',
    label: 'United Nations Agency',
  },
  {
    value: '3',
    label: 'Governments',
  },
];

const PartnerProfileFundingDonors = (props) => {
  const { readOnly } = props;
  return (<FormSection name="major_donors">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="donors"
            label="Please select the type of donors that fund your agency"
            values={DONORS_MENU}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Please list your main donors for programme activities"
            placeholder="200 character maximum"
            fieldName="main_donors_list"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Please list your main donors for core funding"
            placeholder="200 character maximum"
            fieldName="source_core_funding"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
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

PartnerProfileFundingDonors.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileFundingDonors;
