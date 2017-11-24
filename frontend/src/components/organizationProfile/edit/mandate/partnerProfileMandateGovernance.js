import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import GridColumn from '../../../common/grid/gridColumn';
import TextFieldForm from '../../../forms/textFieldForm';
import FileForm from '../../../forms/fileForm';

const messages = {
  structure: 'Briefly describe the organization\'s governance structure',
  headquaters: "Briefly describe the headquarters' oversight of country/ branch office operations including any reporting requirements of the country/branch offices to HQ.",
  organigram: 'Your most up-to-date organigram (optional)',
};

const PartnerProfileMandateGovernance = (props) => {
  const { readOnly, isCountryProfile } = props;

  return (
    <FormSection name="governance">
      <GridColumn>
        <TextFieldForm
          label={messages.structure}
          fieldName="governance_structure"
          textFieldProps={{
            multiline: true,
            inputProps: {
              maxLength: '5000',
            },
          }}
          warn
          readOnly={readOnly}
        />
        {!isCountryProfile ? <TextFieldForm
          label={messages.headquaters}
          fieldName="governance_hq"
          textFieldProps={{
            multiline: true,
            inputProps: {
              maxLength: '5000',
            },
          }}
          warn
          readOnly={readOnly}
        /> : null}
        <FileForm
          formName="partnerProfile"
          sectionName="mandate_mission.governance"
          label={messages.organigram}
          fieldName="governance_organigram"
          optional
          readOnly={readOnly}
        />
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateGovernance.propTypes = {
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.bool,
};

const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);

  return {
    isCountryProfile: partner ? !partner.is_hq : false,
  };
}, null)(PartnerProfileMandateGovernance);

export default withRouter(connected);
