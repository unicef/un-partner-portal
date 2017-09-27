import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
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

const PartnerProfileCollaborationHistory = (props) => {
  const { readOnly } = props;

  return (<FormSection name="history">
    <Grid item>
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <FormControl fullWidth>
            <FormLabel>{'My Partnerships'}</FormLabel>
            <Grid item >
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Grid container direction="row">
                    <Grid item sm={6} xs={12}>
                      <SelectForm
                        fieldName="organization"
                        label={'Select UN agency your organization has ever collaborated with ' +
                        '(optional)'}
                        values={PARTNER_MENU}
                        optional
                        readOnly={readOnly}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item>
                <Grid container direction="column" spacing={16}>
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
                      readOnly={readOnly}
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
                      readOnly={readOnly}
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
        <Grid item>
          <SelectForm
            fieldName="collaborations_partnership_other"
            label="Please indicate if you have collaborated with any other UN Agency (optional)"
            values={PARTNER_MENU}
            selectFieldProps={{
              multiple: true,
            }}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <RadioForm
            fieldName="partnership_collaborate_institution"
            label={'Has the organization collaborated with a member of a cluster, professional ' +
            'network, consortium or any similar institution?'}
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label={'Please state which cluster, network or consortium and briefly explain the ' +
            'collaboration'}
            placeholder=""
            fieldName="partnership_collaborate_institution_desc"
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

PartnerProfileCollaborationHistory.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaborationHistory;
