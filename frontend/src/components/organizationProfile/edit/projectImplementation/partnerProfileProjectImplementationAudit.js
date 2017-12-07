import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedAuditTypes, selectNormalizedCapacityAssessments } from '../../../../store';
import { visibleIfYes, visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import { url } from '../../../../helpers/validation';

const messages = {
  isRegularyAudited: 'Is the organization regularly audited?',
  organizationUndergoes: 'Please indicate the type(s) of audits the organization undergoes?',
  comment: 'Please comment',
  copyOfRecentAudit: 'Copy of your most recent audit report',
  insertLink: 'Or insert the link to the report from the organization\'s website',
  accountabilityIssues: 'Were there any major accountability issues highlighted by audits in ' +
                  'the past three years?',
  formalCapacity: 'Has the organization undergone a formal capacity assessment?',
  indicateAssessments: 'Please indicate which assessment(s)',
  copyOfAssessment: 'Copy of the assessment report',
};

const PartnerProfileProjectImplementationAudit = (props) => {
  const { auditTypes, capacityAssessments, hasCapacityAssessment, isRegularyAudited,
    accountabilityIssues, mostRecentAuditReport, auditLinkReport, readOnly } = props;

  return (
    <FormSection name="audit">
      <GridColumn>
        <RadioForm
          fieldName="regular_audited"
          label={messages.isRegularyAudited}
          values={BOOL_VAL}
          warn
          readOnly={readOnly}
        />
        {visibleIfNo(isRegularyAudited)
          ? <TextFieldForm
            label={messages.comment}
            fieldName="regular_audited_comment"
            textFieldProps={{
              multiline: true,
              inputProps: {
                maxLength: '5000',
              },
            }}
            warn
            readOnly={readOnly}
          />
          : null}
        {visibleIfYes(isRegularyAudited)
          ? <SelectForm
            fieldName="org_audits"
            label={messages.organizationUndergoes}
            values={auditTypes}
            multiple
            warn
            readOnly={readOnly}
          />
          : null}
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <FileForm
              sectionName="project_impl.audit"
              formName="partnerProfile"
              fieldName="most_recent_audit_report"
              label={messages.copyOfRecentAudit}
              optional={(mostRecentAuditReport || auditLinkReport)}
              warn={!(mostRecentAuditReport || auditLinkReport)}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.insertLink}
              fieldName="audit_link_report"
              validation={[url]}
              optional={(mostRecentAuditReport || auditLinkReport)}
              warn={!(mostRecentAuditReport || auditLinkReport)}
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
        <RadioForm
          fieldName="major_accountability_issues_highlighted"
          label={messages.accountabilityIssues}
          values={BOOL_VAL}
          warn
          readOnly={readOnly}
        />
        {visibleIfYes(accountabilityIssues)
          ? <TextFieldForm
            label={messages.comment}
            fieldName="comment"
            textFieldProps={{
              multiline: true,
              inputProps: {
                maxLength: '5000',
              },
            }}
            warn
            readOnly={readOnly}
          />
          : null}
        <RadioForm
          fieldName="capacity_assessment"
          label={messages.formalCapacity}
          values={BOOL_VAL}
          warn
          readOnly={readOnly}
        />
        {visibleIfYes(hasCapacityAssessment)
          ? <div>
            <SelectForm
              fieldName="assessments"
              label={messages.indicateAssessments}
              values={capacityAssessments}
              multiple
              warn
              readOnly={readOnly}
            />
            <FileForm
              formName="partnerProfile"
              sectionName="project_impl.audit"
              fieldName="assessment_report"
              label={messages.copyOfAssessment}
              warn
              readOnly={readOnly}
            />
          </div>
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileProjectImplementationAudit.propTypes = {
  readOnly: PropTypes.bool,
  auditTypes: PropTypes.array,
  capacityAssessments: PropTypes.array,
  isRegularyAudited: PropTypes.bool,
  accountabilityIssues: PropTypes.bool,
  mostRecentAuditReport: PropTypes.string,
  auditLinkReport: PropTypes.string,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    isRegularyAudited: selector(state, 'project_impl.audit.regular_audited'),
    accountabilityIssues: selector(state, 'project_impl.audit.major_accountability_issues_highlighted'),
    hasCapacityAssessment: selector(state, 'project_impl.audit.capacity_assessment'),
    mostRecentAuditReport: selector(state, 'project_impl.audit.most_recent_audit_report'),
    auditLinkReport: selector(state, 'project_impl.audit.audit_link_report'),
    capacityAssessments: selectNormalizedCapacityAssessments(state),
    auditTypes: selectNormalizedAuditTypes(state),
  }),
)(PartnerProfileProjectImplementationAudit);

