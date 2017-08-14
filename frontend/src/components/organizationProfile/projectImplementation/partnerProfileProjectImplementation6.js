import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes'
  },
  {
    value: 'no',
    label: 'No'
  }
]

const AUDIT_TYPES = [
  {
    value: '1',
    label: 'Internal Audit'
  },
  {
    value: '2',
    label: 'Financial Statement Audit'
  },
  {
    value: '3',
    label: 'Donor Audit'
  },
]

class PartnerProfileProjectImplementation6 extends Component {

  constructor(props) {
    super(props);
    this.state = { annualReports: undefined, auditTypes: undefined, hadAuditIssues: undefined, hadCapacityAssessment: undefined };
    this.handleAnnualReportsFieldChange = this.handleAnnualReportsFieldChange.bind(this);
    this.handleAuditTypesFieldChange = this.handleAuditTypesFieldChange.bind(this);
    this.handleAuditIssuesFieldChange = this.handleAuditIssuesFieldChange.bind(this);
    this.handleCapacityAssessmentFieldChange = this.handleCapacityAssessmentFieldChange.bind(this);

  }

  handleAnnualReportsFieldChange(value) {
    this.setState({ annualReports: value });
  }

  handleAuditTypesFieldChange(value) {
    this.setState({ auditTypes: value });
  }

  handleAuditIssuesFieldChange(value) {
    this.setState({ hadAuditIssues: value });
  }

  handleCapacityAssessmentFieldChange(value) {
    this.setState({ hadCapacityAssessment: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Briefly explain the key results achieved by your organization over the last year"
              placeholder='200 character maximum'
              fieldName='achievements'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <SelectForm
                  fieldName='annualReports'
                  label='Does the organization publish annual reports?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleAnnualReportsFieldChange}
                />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextFieldForm
                    label="Date of most recent annual report"
                    placeholder='DD/MM/YYYY'
                    fieldName='date'
                  />
                </Grid>
              </Grid>
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                  <TextFieldForm
                    label="Copy of your most rescent audit report"
                    placeholder='UPLOAD FILE'
                    fieldName='date'
                  />
                </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Or insert the link to the report form the organization's website"
                  placeholder='200 character maximum'
                  fieldName='approachDescription'
                  textFieldProps={{
                    inputProps: {
                      maxLength:'200'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileProjectImplementation6;
