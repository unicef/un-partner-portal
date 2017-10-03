import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import DatePickerForm from '../../../forms/datePickerForm';
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
    <FormSection name="report">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <TextFieldForm
              label="Briefly explain the key results achieved by your organization over the last year"
              placeholder="200 character maximum"
              fieldName="key_result"
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
                <RadioForm
                  fieldName="publish_annual_reports"
                  label="Does the organization publish annual reports?"
                  values={BOOL_VAL}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePickerForm
                  label="Date of most recent annual report"
                  fieldName="last_report"
                  placeholder="Provide Date"
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
                <FileForm
                  label="Copy of your most rescent audit report"
                  placeholder="UPLOAD FILE"
                  fieldName="report"
                  optional
                  warn
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Or link to the report form the organization's website"
                  placeholder="200 character maximum"
                  fieldName="link_report"
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
