import React from 'react';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';

import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';

const PARTNER_MENU = [
  {
    value: '1',
    label: 'UNHCR',
  },
  {
    value: '2',
    label: 'UNICEF',
  },
];

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

const PartnerProfileCollaborationHistory = () => (
  <FormSection name="history">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <FormControl fullWidth>
            <FormLabel>{'My Partnerships'}</FormLabel>
            <Grid item >
              <Grid container direction="column" gutter={16}>
                <Grid item>
                  <Grid container direction="row">
                    <Grid item sm={6} xs={12}>
                      <SelectForm
                        fieldName="organization"
                        label={'Select UN agency your organization has ever collaborated with ' +
                        '(optional)'}
                        values={PARTNER_MENU}
                        optional
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item>
                <Grid container direction="column" gutter={16}>
                  <Grid item sm={6} xs={12}>
                    <TextFieldForm
                      label="Briefly explain the collaboration with the agency selected (optional)"
                      placeholder="200 character maximum"
                      fieldName="fundingDescription"
                      textFieldProps={{
                        inputProps: {
                          maxLength: '200',
                        },
                      }}
                      optional
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextFieldForm
                      label="Partner Number (optional)"
                      placeholder="200 character maximum"
                      fieldName="partnerNumber"
                      textFieldProps={{
                        inputProps: {
                          maxLength: '200',
                        },
                      }}
                      optional
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                href="https://github.com/callemall/material-ui"
                target="_blank"
                label="GitHub Link"
                secondary
              >
                + Add new
              </Button>
            </Grid>
          </FormControl>
        </Grid>
        <Grid>
          <SelectForm
            fieldName="otherAgency"
            label="Please indicate if you have collaborated with any other UN Agency (optional)"
            values={PARTNER_MENU}
            selectFieldProps={{
              multiple: true,
            }}

          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="hasFraudSafeguard"
            label={'Has the organization collaborated with a member of a cluster, professional ' +
            'network, consortium or any similar institution?'}
            values={BOOL_VAL}
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label={'Please state which cluster, network or consortium and briefly explain the ' +
            'collaboration'}
            placeholder=""
            fieldName="fraudSafeguardComment"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileCollaborationHistory;
