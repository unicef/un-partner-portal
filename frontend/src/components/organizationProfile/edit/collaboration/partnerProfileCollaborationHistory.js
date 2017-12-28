import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import ArrayForm from '../../../forms/arrayForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import AgencySelectField from '../../../forms/fields/projectFields/agencies';

const messages = {
  explainCollaboration: 'Briefly explain the collaboration with the agency selected (optional)',
  provideNumber: 'Please provide your Vendor/Partner Number (If applicable)',
  selectAgency: 'Please indicate whether your organization has collaborated with any UN agencies',
  hasPartnership: 'Has your organization partnered with UN agency?',
  hasCollaborated: 'Has the organization collaborated with or participated as a member of a cluster, professional network, consortium or any similar institution?',
  collaborationDesc: 'Please state which cluster, network or consortium and briefly explain the ' +
            'collaboration',
};

const AgencySelection = (values, readOnly, ...props) => (member, index, fields) => (
  <GridColumn>
    <AgencySelectField
      fieldName={`${member}.agency`}
      label={messages.selectAgency}
      readOnly={readOnly}
      optional
      warn
    />
  </GridColumn>
);

const PartnershipInner = (readOnly, ...props) => member => (
  <div>
    <TextFieldForm
      label={messages.explainCollaboration}
      fieldName={`${member}.description`}
      textFieldProps={{
        multiline: true,
        inputProps: {
          maxLength: '5000',
        },
      }}
      optional
      readOnly={readOnly}
      {...props}
    />

    <Grid container>
      <Grid item sm={6} xs={12}>
        <TextFieldForm
          label={messages.provideNumber}
          fieldName={`${member}.partner_number`}
          textFieldProps={{
            multiline: true,
            inputProps: {
              maxLength: '5000',
            },
          }}
          optional
          readOnly={readOnly}
          {...props}
        />
      </Grid>
      <Grid item sm={6} xs={12} />
    </Grid>
  </div>
);

const PartnerProfileCollaborationHistory = (props) => {
  const { readOnly, hasCollaborated, hasPartnership, agency } = props;

  return (<FormSection name="history">
    <GridColumn>
      <RadioForm
        fieldName="any_partnered_with_un"
        label={messages.hasCollaborated}
        values={BOOL_VAL}
        warn
        optional
        readOnly={readOnly}
      />
      {visibleIfYes(hasPartnership)
        ? <ArrayForm
          limit={15}
          fieldName="collaborations_partnership"
          initial
          readOnly={readOnly}
          outerField={AgencySelection(agency, readOnly)}
          innerField={PartnershipInner(readOnly)}
        />
        : null}
      <RadioForm
        fieldName="partnership_collaborate_institution"
        label={messages.hasCollaborated}
        values={BOOL_VAL}
        warn
        optional
        readOnly={readOnly}
      />
      {visibleIfYes(hasCollaborated)
        ? <TextFieldForm
          label={messages.collaborationDesc}
          fieldName="partnership_collaborate_institution_desc"
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
    </GridColumn>
  </FormSection>
  );
};

PartnerProfileCollaborationHistory.propTypes = {
  readOnly: PropTypes.bool,
  hasCollaborated: PropTypes.bool,
  hasPartnership: PropTypes.bool,
  agency: PropTypes.array,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    agency: [],
    hasPartnership: selector(state, 'collaboration.history.any_partnered_with_un'),
    hasCollaborated: selector(state, 'collaboration.history.partnership_collaborate_institution'),
  }),
)(PartnerProfileCollaborationHistory);
