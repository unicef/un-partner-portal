import React from 'react';
import PropTypes from 'prop-types';
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

const PartnerProfileIdentificationBasicInfo = (props) => {
  const { countries, organizationTypes } = props;

  return (
    <FormSection name="basic">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <TextFieldForm
            label={messages.legalName}
            fieldName="legal_name"
            optional
            warn
            readOnly
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.alias}
              fieldName="alias_name"
              optional
              warn
              readOnly
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.acronym}
              fieldName="acronym"
              optional
              warn
              readOnly
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.formerLegalName}
              fieldName="former_legal_name"
              optional
              warn
              readOnly
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
  organizationTypes: PropTypes.array.isRequired,
};

export default connect(state => ({
  countries: selectNormalizedCountries(state),
  organizationTypes: selectNormalizedOrganizationTypes(state),
}), null)(PartnerProfileIdentificationBasicInfo);

