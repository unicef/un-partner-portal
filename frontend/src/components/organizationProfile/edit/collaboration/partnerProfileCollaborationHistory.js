import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import ArrayForm from '../../../forms/arrayForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  myPartnership: 'My Partnership',
  explainCollaboration: 'Briefly explain the collaboration with the agency selected (optional)',
  provideNumber: 'Please provide your Vendor/Partner Number (If applicable)',
  selectAgency: 'Select UN agency your organization has ever collaborated with (optional)',
  hasCollaborated: 'Has the organization collaborated with a member of a cluster, professional ' +
            'network, consortium or any similar institution?',
  collaborationDesc: 'Please state which cluster, network or consortium and briefly explain the ' +
            'collaboration',
};

const AgencySelection = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenAreas = fields.getAll().map(field => field.area);
  const ownArea = fields.get(index).area;
  const newValues = values.filter(value =>
    (ownArea === value.value) || !(chosenAreas.includes(value.value)));

  return (
    <GridColumn>
      <SelectForm
        fieldName={`${member}.area`}
        label={messages.selectAgency}
        values={newValues}
        readOnly={readOnly}
        optional
        warn
        {...props}
      />
    </GridColumn>
  );
};

const PartnershipInner = (readOnly, ...props) => member => (
  <div>
    <TextFieldForm
      label={messages.explainCollaboration}
      fieldName={`${member}.description`}
      textFieldProps={{
        inputProps: {
          maxLength: '200',
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
            inputProps: {
              maxLength: '200',
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
  const { readOnly, hasCollaborated, agency } = props;

  return (<FormSection name="history">
    <GridColumn>
      <ArrayForm
        label={messages.myPartnership}
        limit={15}
        fieldName="collaborations_partnership"
        initial
        readOnly={readOnly}
        outerField={AgencySelection(agency, readOnly)}
        innerField={PartnershipInner(readOnly)}
      />
      <RadioForm
        fieldName="partnership_collaborate_institution"
        label={messages.hasCollaborated}
        values={BOOL_VAL}
        optional
        warn
        readOnly={readOnly}
      />
      {visibleIfYes(hasCollaborated)
        ? <TextFieldForm
          label={messages.collaborationDesc}
          fieldName="partnership_collaborate_institution_desc"
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
          optional
          warn
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
  agency: PropTypes.array,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    agency: [],
    hasCollaborated: selector(state, 'collaboration.history.partnership_collaborate_institution'),
  }),
)(PartnerProfileCollaborationHistory);
