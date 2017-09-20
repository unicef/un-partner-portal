import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';


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

const PartnerProfileMandateSecurity = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="security">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName="security_high_risk_locations"
                  label={'Does the organization have the ablility to work in high-risk securit' +
                'locations?'}
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName="security_high_risk_policy"
                  label={'Does the organization have policies, procedures and practices related to ' +
                'security risk management?'}
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item >
            <TextFieldForm
              label={'Briefly describe the organization\'s ability, if any, to scale-up ' +
            'operations in emergencies or other situations requiring rapid response.'}
              placeholder="Please comment"
              fieldName="security_desc"
              textFieldProps={{
                inputProps: {
                  maxLength: '200',
                },
              }}
              optional
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileMandateSecurity.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateSecurity;
