import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import Grid from 'material-ui/Grid';
import { selectNormalizedCountries } from '../../store';
import SelectForm from '../forms/selectForm';
import TextFieldForm from '../forms/textFieldForm';
import PolarRadio from '../forms/fields/PolarRadio';
import { email } from '../../helpers/validation';

const messages = {
  tooltip: 'Country of Origin: Country of origin refers to the ' +
  'country where an organization’s headquarters is located.',
  legalName: "Organization's Legal Name",
  alias: 'Alias (optional)',
  aliasPlaceholder: 'Provide alias',
};

const BasicInformation = (props) => {
  const { legalNameChange, countries } = props;
  return (
    <Grid item>
      <Grid container direction="column" spacing={16}>
        <TextFieldForm
          label={messages.legalName}
          fieldName="json.partner.legal_name"
        />
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label={messages.alias}
            placeholder={messages.aliasPlaceholder}
            fieldName="json.partner_profile.alias_name"
            optional
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label={'Acronym (If applicable)'}
            placeholder="Provide acronym"
            fieldName="acronym"
            optional
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <PolarRadio
            fieldName="json.partner_profile.legal_name_change"
            label="Has the Organization had a legal name change?"
          />
        </Grid>
        {legalNameChange === true &&
          (<TextFieldForm
            label="Organization's former Legal Name"
            fieldName="json.partner_profile.former_legal_name"
          />)}
        <SelectForm
          fieldName="json.partner.country_code"
          label="Country of Origin"
          values={countries}
          infoIcon
          infoText={messages.tooltip}
        />
        <Grid item>
          <TextFieldForm
            label="Head of Organization's Personal Name"
            placeholder="Provide Personal Name"
            fieldName="json.partner_head_organization.fullname"
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="E-mail of Head of Organization"
            placeholder="Provide Email"
            fieldName="json.partner_head_organization.email"
            validation={[email]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

BasicInformation.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  legalNameChange: PropTypes.bool,
  countries: PropTypes.arrayOf(PropTypes.string),
};

const selector = formValueSelector('registration');
const connectedBasicInformation = connect(
  state => ({
    legalNameChange: selector(state, 'json.partner_profile.legal_name_change'),
    countries: selectNormalizedCountries(state),
  }),
)(BasicInformation);

export default connectedBasicInformation;
