import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import { PLACEHOLDERS } from '../../../../helpers/constants';

const messages = {
  resultsBasedApproachTooltip: 'Results-based approach: aims to improve management effectiveness ' +
  'and accountability by defining realistic expected results, monitoring progress toward the ' +
  'achievement of expected results, integrating lessons learned into management decisions and ' +
  'reporting on performance',
  resultsBasedApproach: 'Does the organization use a results-based approach to managing programmes and projects?',
  resultsDescription: 'Please provide a brief description of your management approach',
  monitoringSystem: 'Does your organization have a system for monitoring and evaluating its programmes and projects?',
  meDescription: 'Briefly explain your M&E system',
  feedbackSystem: 'Does the organization have systems or procedures in place for ' +
                'beneficiaries to provide feedback on project activities?',
  feedbackDescription: 'Briefly explain your feedback mechanism',
};

const PartnerProfileProjectImplementationManagement = (props) => {
  const { readOnly, resultsBasedApproach, monitoringSystem, feedbackSystem } = props;

  return (
    <FormSection name="program_management">
      <GridColumn>
        <RadioForm
          fieldName="have_management_approach"
          label={messages.resultsBasedApproach}
          values={BOOL_VAL}
          warn
          optional
          infoText={messages.resultsBasedApproachTooltip}
          readOnly={readOnly}
        />
        {visibleIfYes(resultsBasedApproach)
          ? <TextFieldForm
            label={messages.resultsDescription}
            placeholder={PLACEHOLDERS.provide}
            fieldName="management_approach_desc"
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '5000',
                },
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        <RadioForm
          fieldName="have_system_monitoring"
          label={messages.monitoringSystem}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(monitoringSystem)
          ? <TextFieldForm
            label={messages.meDescription}
            placeholder={PLACEHOLDERS.explain}
            fieldName="system_monitoring_desc"
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '5000',
                },
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        <RadioForm
          fieldName="have_feedback_mechanism"
          label={messages.feedbackSystem}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(feedbackSystem)
          ? <TextFieldForm
            label={messages.feedbackDescription}
            fieldName="feedback_mechanism_desc"
            placeholder={PLACEHOLDERS.explain}
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '5000',
                },
              },
            }}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileProjectImplementationManagement.propTypes = {
  readOnly: PropTypes.bool,
  resultsBasedApproach: PropTypes.bool,
  monitoringSystem: PropTypes.bool,
  feedbackSystem: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    resultsBasedApproach: selector(state, 'project_impl.program_management.have_management_approach'),
    monitoringSystem: selector(state, 'project_impl.program_management.have_system_monitoring'),
    feedbackSystem: selector(state, 'project_impl.program_management.have_feedback_mechanism'),
  }),
)(PartnerProfileProjectImplementationManagement);
