import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';

import TextFieldForm from '../../../forms/textFieldForm';


const PartnerProfileMandateGovernance = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="governance" >
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <TextFieldForm
              label="Briefly describe the organization's governance structure"
              placeholder="Please limit your response to 200 characters"
              fieldName="structure"
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
              label="Your most up-to-date organigram"
              placeholder="Upload File"
              fieldName="organigram"
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

PartnerProfileMandateGovernance.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateGovernance;
