import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';

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

const AUDIT_TYPES = [
  {
    value: '1',
    label: 'Internal Audit',
  },
  {
    value: '2',
    label: 'Financial Statement Audit',
  },
  {
    value: '3',
    label: 'Donor Audit',
  },
];

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const PartnerProfileProjectImplementationAudit = (props) => {
  const { hadCapacityAssessment } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="audited"
            label="Is the organization regularly audited?"
            values={BOOL_VAL}
            onFieldChange={this.handleAuditedFieldChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="auditTypes"
            label="Please indicate the type(s) of audits the organization undergoes?"
            values={AUDIT_TYPES}
            onFieldChange={this.handleAuditTypesFieldChange}
            selectFieldProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <SelectForm
                fieldName="auditTypes"
                label="Please upload a copy of your most recent audit report?"
                values={AUDIT_TYPES}
                onFieldChange={this.handleAuditTypesFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Or insert the link to the report from the organization's website"
                placeholder="200 character maximum"
                fieldName="orgWebsite"
                textFieldProps={{
                  inputProps: {
                    maxLength: '200',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hadAuditIssues"
                label="Were there any major accountability isses highlighted by audits in the past three years?"
                values={BOOL_VAL}
                onFieldChange={this.handleAuditIssuesFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Please comment"
                placeholder="200 character maximum"
                fieldName="approachDescription"
                textFieldProps={{
                  inputProps: {
                    maxLength: '200',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="hadCapacityAssessment"
            label="Has the organization undergone a formal capacity assessment?"
            values={BOOL_VAL}
            onFieldChange={this.handleCapacityAssessmentFieldChange}
          />
        </Grid>
        {hadCapacityAssessment === 'yes' &&
            (<TextFieldForm
              label="Please indicate which assessment(s)"
              fieldName="formerLegalName"
            />)}
        {hadCapacityAssessment === 'yes' &&
          (<TextFieldForm
            label="Copy of the assessment report"
            fieldName="formerLegalName"
          />)}
      </Grid>
    </Grid>
  );
};

PartnerProfileProjectImplementationAudit.propTypes = {
  /**
   * css classes
   */
  hadCapacityAssessment: PropTypes.bool,
};

const selector = formValueSelector('registration');
const ConnectedPartnerProfileProjectImplementationAudit = connect(
  state => ({
    hadCapacityAssessment: selector(state, 'hadCapacityAssessment'),
  }),
)(PartnerProfileProjectImplementationAudit);

export default ConnectedPartnerProfileProjectImplementationAudit;
