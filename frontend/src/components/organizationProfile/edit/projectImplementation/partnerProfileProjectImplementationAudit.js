import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import ArrayForm from '../../../forms/arrayForm';
import { selectNormalizedAuditTypes, selectNormalizedCapacityAssessments } from '../../../../store';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import { url } from '../../../../helpers/validation';
import { PLACEHOLDERS } from '../../../../helpers/constants';

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
  organizationUndergoesTooltip: ['Internal audit: refers to an independent, objective assurance ' +
  'and consulting activity that is undertaken by either an organization’s own employees, or an ' +
  'external auditor, to evaluate the effectiveness of an organization’s risk management, control ' +
  'and governance processes.',
  'Financial statement audit: also known as an external audit, refers to an audit that is ' +
  'undertaken by an external auditor to provide independent assurance that an organization’s ' +
  'management has, in its financial statements, presented a “true and fair” view of the ' +
  'organization’s financial performance and position.',
  'Donor audit: refers to an audit that is undertaken, either by an organization’s external ' +
  'auditors or commissioned by donors themselves, to obtain assurance that expenditure on a ' +
  'donor-funded project or programme is in compliance with the conditions of the donor agreement ' +
  'and any other donor regulations.'].join('\n\n'),
};

const Audit = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenAudits = fields.getAll().map(field => field.org_audit);
  const ownAudit = fields.get(index).org_audit;
  const newValues = values.filter(value =>
    (ownAudit === value.value) || !(chosenAudits.includes(value.value)));

  return (<Grid container direction="row">
    <Grid item sm={12} xs={12}>
      <SelectForm
        fieldName={`${member}.org_audit`}
        label={messages.organizationUndergoes}
        infoText={messages.organizationUndergoesTooltip}
        values={newValues}
        readOnly={readOnly}
        placeholder={PLACEHOLDERS.indicate}
        optional
        warn
        {...props}
      />
    </Grid>
  </Grid>
  );
};

const Info = (readOnly, ...props) => (member, index, fields) => {
  const mostRecentAuditReport = fields.get(index).most_recent_audit_report;
  const auditLinkReport = fields.get(index).audit_link_report;

  return (<Grid container direction="row">
    <Grid item sm={6} xs={12}>
      <FileForm
        sectionName={`${member}.most_recent_audit_report`}
        formName="partnerProfile"
        fieldName={`${member}.most_recent_audit_report`}
        label={messages.copyOfRecentAudit}
        optional
        warn={!(mostRecentAuditReport || auditLinkReport)}
        readOnly={readOnly}
      />
    </Grid>
    <Grid item sm={6} xs={12}>
      <TextFieldForm
        label={messages.insertLink}
        fieldName={`${member}.audit_link_report`}
        placeholder={PLACEHOLDERS.indicate}
        validation={[url]}
        optional
        warn={!(mostRecentAuditReport || auditLinkReport)}
        readOnly={readOnly}
      />
    </Grid>
  </Grid>);
};

const AssessmentType = (values, readOnly) => (member, index, fields) => (<Grid container direction="row">
  <Grid item sm={12} xs={12}>
    <SelectForm
      fieldName={`${member}.assessment_type`}
      label={messages.indicateAssessments}
      values={values}
      warn
      placeholder={PLACEHOLDERS.select}
      optional
      readOnly={readOnly}
    />
  </Grid>
</Grid>
);

const AssessmentReport = readOnly => (member, index, fields) => (<Grid container direction="row">
  <Grid item sm={6} xs={12}>
    <FileForm
      formName="partnerProfile"
      sectionName={`${member}.report_file`}
      fieldName={`${member}.report_file`}
      label={messages.copyOfAssessment}
      warn
      optional
      readOnly={readOnly}
    />
  </Grid>
</Grid>);

const PartnerProfileProjectImplementationAudit = (props) => {
  const { auditTypes, capacityAssessments, hasCapacityAssessment, isRegularyAudited,
    accountabilityIssues, readOnly } = props;

  return (
    <FormSection name="audit">
      <GridColumn>
        <RadioForm
          fieldName="regular_audited"
          label={messages.isRegularyAudited}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(isRegularyAudited)
          ? <React.Fragment>
            <ArrayForm
              label={messages.sectorsAndSpecialization}
              limit={auditTypes.length}
              fieldName="audit_reports"
              initial
              readOnly={readOnly}
              outerField={Audit(auditTypes, readOnly)}
              innerField={Info(readOnly)}
            />
            <RadioForm
              fieldName="major_accountability_issues_highlighted"
              label={messages.accountabilityIssues}
              values={BOOL_VAL}
              warn
              optional
              readOnly={readOnly}
            />
            {visibleIfYes(accountabilityIssues)
              ? <TextFieldForm
                label={messages.comment}
                placeholder={PLACEHOLDERS.provide}
                fieldName="comment"
                textFieldProps={{
                  multiline: true,
                  inputProps: {
                    maxLength: '5000',
                  },
                }}
                warn
                optional
                readOnly={readOnly}
              />
              : null}
          </React.Fragment>
          : <TextFieldForm
            label={messages.comment}
            fieldName="regular_audited_comment"
            textFieldProps={{
              multiline: true,
              inputProps: {
                maxLength: '5000',
              },
            }}
            warn
            optional
            readOnly={readOnly}
          />}

        <RadioForm
          fieldName="capacity_assessment"
          label={messages.formalCapacity}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(hasCapacityAssessment)
          ? <div>
            <ArrayForm
              label={messages.sectorsAndSpecialization}
              limit={200}
              fieldName="capacity_assessments"
              initial
              readOnly={readOnly}
              outerField={AssessmentType(capacityAssessments, readOnly)}
              innerField={AssessmentReport(readOnly)}
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
  isRegularyAudited: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  accountabilityIssues: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    isRegularyAudited: selector(state, 'project_impl.audit.regular_audited'),
    accountabilityIssues: selector(state, 'project_impl.audit.major_accountability_issues_highlighted'),
    hasCapacityAssessment: selector(state, 'project_impl.audit.capacity_assessment'),
    capacityAssessments: selectNormalizedCapacityAssessments(state),
    auditTypes: selectNormalizedAuditTypes(state),
  }),
)(PartnerProfileProjectImplementationAudit);

