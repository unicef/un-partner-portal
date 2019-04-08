import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormSection, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import CountryField from '../../../forms/fields/projectFields/locationField/countryField';
import { selectNormalizedOrganizationTypes } from '../../../../store';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  legalName: 'Organization\'s Legal Name',
  alias: 'Alias (if applicable)',
  acronym: 'Acronym (If applicable)',
  formerLegalName: 'Organization\'s former Legal Name (optional)',
  countryOrigin: 'Country of Origin',
  organizationType: 'Type of organization',
};

const isReadOnly = (isHq, displayType, readOnly) => readOnly || !(!isHq && displayType === 'Int');

const PartnerProfileIdentificationBasicInfo = (props) => {
  const { isCountryProfile, displayType, readOnly, countryCode, organizationTypes } = props;

  return (
    <FormSection name="basic">
      <GridColumn>
          <TextFieldForm
            label={messages.legalName}
            fieldName="legal_name"
            warn
            optional
            readOnly={isReadOnly(isCountryProfile, displayType, readOnly)} />
            <TextFieldForm
              label={messages.alias}
              fieldName="alias_name"
              optional
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            /> 
            <TextFieldForm
              label={messages.acronym}
              fieldName="acronym"
              optional
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            /> 
            <TextFieldForm
              label={messages.formerLegalName}
              fieldName="former_legal_name"
              optional
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            /> 
            <CountryField
              label={messages.countryOrigin}
              fieldName="country_code_origin"
              initialValue={countryCode}
              readOnly
            /> 
            <SelectForm
              fieldName="display_type"
              label={messages.organizationType}
              values={organizationTypes}
              optional
              warn
              readOnly
            /></GridColumn>
    </FormSection>
  );
};

PartnerProfileIdentificationBasicInfo.propTypes = {
  countryCode: PropTypes.string,
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.bool,
  displayType: PropTypes.string,
  organizationTypes: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');

const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
  || state.agencyPartnersList.data.partners);
  const displayType = partner ? partner.display_type : null;
  const isCountryProfile = partner ? partner.is_hq : false;
  const country = selector(state, 'identification.basic.country_code');
  const countryOrigin = selector(state, 'identification.basic.country_of_origin');
  const countryCode = countryOrigin || country;

  return {
    countryCode,
    displayType,
    isCountryProfile,
    organizationTypes: selectNormalizedOrganizationTypes(state),
  };
}, null)(PartnerProfileIdentificationBasicInfo);

export default withRouter(connected);

