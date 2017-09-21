import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
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

const PartnerProfileProjectImplementationAudit = (props) => {
  const { hadCapacityAssessment, readOnly } = props;

  return (
    <FormSection name="audit">
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <RadioForm
            fieldName="regular_audited"
            label="Is the organization regularly audited?"
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <SelectForm
            fieldName="org_audits"
            label="Please indicate the type(s) of audits the organization undergoes?"
            values={AUDIT_TYPES}
            selectFieldProps={{
              multiple: true,
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
                fieldName="most_recent_audit_report"
                label="Copy of your most recent audit report"
                values={AUDIT_TYPES}
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Or insert the link to the report from the organization's website"
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
        <Grid item>
          <RadioForm
            fieldName="major_accountability_issues_highlighted"
            label={'Were there any major accountability isses highlighted by audits in ' +
                  'the past three years?'}
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Please comment"
            placeholder="200 character maximum"
            fieldName="comment"
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
            fieldName="capacity_assessment"
            label="Has the organization undergone a formal capacity assessment?"
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        {hadCapacityAssessment ?
          <Grid item>
            <Grid container direction="column" gutter={16}>
              <Grid item>
                <TextFieldForm
                  label="Please indicate which assessment(s)"
                  fieldName="formerLegalName"
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item>
                <TextFieldForm
                  label="Copy of the assessment report"
                  fieldName="formerLegalName"
                  optional
                  warn
                  readOnly={readOnly}
                /></Grid>
            </Grid>
          </Grid>
          : null}
      </Grid>
    </FormSection>
  );
};

PartnerProfileProjectImplementationAudit.propTypes = {
  /**
   * css classes
   */
  hadCapacityAssessment: PropTypes.bool,

  readOnly: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hadCapacityAssessment: selector(state, 'project_impl.audit.capacity_assessment'),
  }),
)(PartnerProfileProjectImplementationAudit);

