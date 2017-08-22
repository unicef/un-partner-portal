import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import RadioForm from '../forms/radioForm';
import SelectForm from '../forms/selectForm';
import TextFieldForm from '../forms/textFieldForm';
import { email } from '../../helpers/validation';

const messages = {
  tooltip: 'Country of Origin: Country of origin refers to the ' +
  'country where an organization’s headquarters is located.',
};

const NAME_CHANGE = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France',
  },
  {
    value: 'it',
    label: 'Italy',
  },
];

const BasicInformation = (props) => {
  const { legalNameChange, countries } = props;
  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <TextFieldForm
          label="Organization's Legal Name"
          fieldName="json.partner.legal_name"
        />
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Alias (optional)"
            placeholder="Provide alias"
            fieldName="json.partner_profile.alias_name"
            optional
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="legalNameChange"
            label="Has the Organization had a legal name change?"
            values={NAME_CHANGE}
          />
        </Grid>
        {legalNameChange === 'yes' &&
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
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Head of Organization's First Name"
                placeholder="Provide First Name"
                fieldName="json.partner_profile.org_head_first_name"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Head of Organization's Last Name"
                placeholder="Provide Last Name"
                fieldName="json.partner_profile.org_head_last_name"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Head of Organization's Email"
            placeholder="Provide Email"
            fieldName="json.partner_profile.org_head_email"
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
};

const selector = formValueSelector('registration');
const connectedBasicInformation = connect(
  state => ({
    legalNameChange: selector(state, 'legalNameChange'),
    countries: state.countries,
  }),
)(BasicInformation);

export default connectedBasicInformation;
