import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedCountries, selectNormalizedOrganizationTypes } from '../../../../store';

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
  const { isCountryProfile, displayType, readOnly, countries, organizationTypes } = props;

  return (
    <FormSection name="basic">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <TextFieldForm
            label={messages.legalName}
            fieldName="legal_name"
            warn
            readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.alias}
              fieldName="alias_name"
              optional
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.acronym}
              fieldName="acronym"
              optional
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.formerLegalName}
              fieldName="former_legal_name"
              warn
              readOnly={isReadOnly(isCountryProfile, displayType, readOnly)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName="country_code"
              label={messages.countryOrigin}
              values={countries}
              optional
              warn
              readOnly
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName="display_type"
              label={messages.organizationType}
              values={organizationTypes}
              optional
              warn
              readOnly
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileIdentificationBasicInfo.propTypes = {
  countries: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  organizationTypes: PropTypes.array.isRequired,
};


const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);

  return {
    isCountryProfile: partner ? partner.is_hq : false,
    displayType: partner ? partner.display_type : null,
    countries: selectNormalizedCountries(state),
    organizationTypes: selectNormalizedOrganizationTypes(state),
  };
}, null)(PartnerProfileIdentificationBasicInfo);

export default withRouter(connected);

