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

const PartnerProfileProjectImplementationManagement = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="program_management">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <RadioForm
              fieldName="have_management_approach"
              label="Does the organization use a results-based approach to managing programmes and projects?"
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Please provide a brief description of your management approach"
              placeholder="200 character maximum"
              fieldName="management_approach_desc"
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
            <RadioForm
              fieldName="have_system_monitoring"
              label={'Does your organization have a system for monitoring and evaluating ' +
                'its projects & programmes?'}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Briefly explain your M&E system"
              placeholder="200 character maximum"
              fieldName="system_monitoring_desc"
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
            <RadioForm
              fieldName="have_feedback_mechanism"
              label={'Does the organization have systems or procedures in place for ' +
                'beneficaries to provide feedback on prject activities?'}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item >
            <TextFieldForm
              label="Briefly explain your feedback mechanism"
              placeholder="200 character maximum"
              fieldName="feedback_mechanism_desc"
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

PartnerProfileProjectImplementationManagement.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementationManagement;
