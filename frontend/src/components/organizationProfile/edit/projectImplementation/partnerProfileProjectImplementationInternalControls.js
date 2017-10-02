import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import { FormLabel } from 'material-ui/Form';

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

const PartnerProfileProjectImplementationInternalControls = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="internalControls">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <FormLabel>{'For each of the following areas of responsibility has the organization instituted safeguards to ensure the following functional responsibilities are appropriately segregated?'}</FormLabel>
          </Grid>
          <Grid item>
            <Paper elevation={4} style={{ maxWidth: '100%', padding: '1em 1em 3em' }}>
              <Grid container direction="column">
                <Grid item>
                  <Grid container direction="column">
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName="procurementSegregated"
                        label="Procurement"
                        values={BOOL_VAL}
                        optional
                        warn
                        readOnly={readOnly}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder="200 character maximum"
                        fieldName="procurementDescription"
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
                    <div />
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName="authorizationSegregated"
                        label="Authorization to execute a transaction"
                        values={BOOL_VAL}
                        optional
                        warn
                        readOnly={readOnly}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder="200 character maximum"
                        fieldName="authorizationDescription"
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
                  <Grid container direction="column">
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName="transactionRecordingSegregated"
                        label="Recording of a transaction"
                        values={BOOL_VAL}
                        optional
                        warn
                        readOnly={readOnly}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder="200 character maximum"
                        fieldName="transactionDescription"
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
            </Paper>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName="adequateStaff"
                  label={'Does the organization have an adequate number of experienced staff ' +
                'responsible for financial management?'}
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder="200 character maximum"
                  fieldName="staffDescription"
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
            <FormLabel>{'Does the organization have formal documented policies applicable to all operations that cover the following policy areas?'}</FormLabel>
          </Grid>
          <Grid item>
            <Paper elevation={4}>
              <Grid container direction="column">
                <Grid item sm={6} xs={12}>
                  <RadioForm
                    fieldName="documentedHR"
                    label="Human Resources"
                    values={BOOL_VAL}
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <RadioForm
                    fieldName="documentedProcurement"
                    label="Procurement"
                    values={BOOL_VAL}
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileProjectImplementationInternalControls.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementationInternalControls;
