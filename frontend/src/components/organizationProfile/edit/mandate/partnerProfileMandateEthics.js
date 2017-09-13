import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
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

const PartnerProfileMandateEthics = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="ethics">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName="hasAbuseSafeguard"
                  label={'Does the organization have a policy or code of conduct to safegaurd ' +
                'against the violation and abuse of beneficiaries?'}
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder=""
                  fieldName="abuseSafeguardComment"
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
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName="hasFraudSafeguard"
                  label={'Does the organization have a policy or code of conduct to safegaurd ' +
                'against fraud and corruption?'}
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder=""
                  fieldName="fraudSafeguardComment"
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
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileMandateEthics.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateEthics;
