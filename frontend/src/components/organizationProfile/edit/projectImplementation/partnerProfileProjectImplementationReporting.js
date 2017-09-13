import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import SelectForm from '../../../forms/selectForm';
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


const PartnerProfileProjectImplementationReporting = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="reporting">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Briefly explain the key results achieved by your organization over the last year"
              placeholder="200 character maximum"
              fieldName="achievements"
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
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <SelectForm
                  fieldName="annualReports"
                  label="Does the organization publish annual reports?"
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Date of most recent annual report"
                  placeholder="DD/MM/YYYY"
                  fieldName="date"
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
                <TextFieldForm
                  label="Copy of your most rescent audit report"
                  placeholder="UPLOAD FILE"
                  fieldName="date"
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Or insert the link to the report form the organization's website"
                  placeholder="200 character maximum"
                  fieldName="approachDescription"
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

PartnerProfileProjectImplementationReporting.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementationReporting;
