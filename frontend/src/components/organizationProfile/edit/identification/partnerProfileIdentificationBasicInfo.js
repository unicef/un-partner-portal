import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormSection, formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import CountryField from '../../../forms/fields/projectFields/locationField/countryField';
import { selectNormalizedOrganizationTypes } from '../../../../store';

const messages = {
  legalName: 'Organization\'s Legal Name',
  alias: 'Alias (if applicable)',
  acronym: 'Acronym (If applicable)',
  formerLegalName: 'Organization\'s former Legal Name',
  countryOrigin: 'Country of Origin',
  organizationType: 'Type of organization',
};

const isReadOnly = (isHq, displayType, readOnly) => readOnly || !(!isHq && displayType === 'Int');

const PartnerProfileIdentificationBasicInfo = (props) => {
  const { isCountryProfile, displayType, readOnly, country, organizationTypes } = props;

  return (
    <FormSection name="basic">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <TextFieldForm
            label={messages.legalName}
            fieldName="legal_name"
            optional
            warn
            readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.alias}
              fieldName="alias_name"
              optional
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.acronym}
              fieldName="acronym"
              optional
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.formerLegalName}
              fieldName="former_legal_name"
              optional
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <CountryField
              fieldName="country_code"
              label={messages.countryOrigin}
              initialValue={country}
              optional
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName="display_type"
              label={messages.organizationType}
              values={organizationTypes}
              optional
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileIdentificationBasicInfo.propTypes = {
  country: PropTypes.string,
  readOnly: PropTypes.bool,
  organizationTypes: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');

const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);
  return {
    isCountryProfile: partner ? partner.is_hq : false,
    displayType: partner ? partner.display_type : null,
    country: selector(state, 'identification.basic.country_code'),
    organizationTypes: selectNormalizedOrganizationTypes(state),
  };
}, null)(PartnerProfileIdentificationBasicInfo);

export default withRouter(connected);

