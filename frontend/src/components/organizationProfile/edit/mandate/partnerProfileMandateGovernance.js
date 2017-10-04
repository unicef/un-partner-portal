import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';

import TextFieldForm from '../../../forms/textFieldForm';
import FileForm from '../../../forms/fileForm';


const PartnerProfileMandateGovernance = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="governance" >
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <TextFieldForm
              label="Briefly describe the organization's governance structure"
              placeholder="Please limit your response to 200 characters"
              fieldName="governance_structure"
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
              label="Briefly describe the headquarters' oversight of country/ branch office operations including any reporting requirements of the country/branch offices to HQ."
              placeholder="Please limit your response to 200 characters"
              fieldName="governance_hq"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <FileForm
              label="Your most up-to-date organigram"
              placeholder="Upload File"
              fieldName="governance_organigram"
              optional
              warn
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileMandateGovernance.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateGovernance;
