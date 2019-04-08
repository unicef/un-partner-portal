import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import CountryField from '../../../forms/fields/projectFields/locationField/countryField';
import { selectNormalizedCountries } from '../../../../store';
import { url, email, phoneNumber } from '../../../../helpers/validation';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';

const messages = {
  mailingType: 'Type of mailing address',
  streetAddress: 'Street Address',
  poBox: 'PO Box',
  streetNumber: 'Street Number',
  city: 'City',
  country: 'Country',
  zipCode: 'Zip Code (optional)',
  poBoxNumber: 'PO Box Number',
  telephone: 'Telephone',
  fax: 'Fax (optional)',
  website: 'Website (optional)',
  organizationEmail: 'Organization Email (optional)',
};

const MAILING_TYPE_VALUES = [
  {
    value: 'Str',
    label: messages.streetAddress,
  },
  {
    value: 'POB',
    label: messages.poBox,
  },
];

const isStreetAddress = type => type && type === MAILING_TYPE_VALUES[0].value;

const PartnerProfileContactInfoAddress = (props) => {
  const { readOnly, country, countries, mailingType } = props;

  return (<FormSection name="address"> 
      <GridColumn>
      <RadioForm
        fieldName="mailing_type"
        label={messages.mailingType}
        values={MAILING_TYPE_VALUES}
        renderTextSelection
        warn
        optional
        readOnly={readOnly}
      /> 
         <GridRow columns={4}>
              <TextFieldForm
                label={isStreetAddress(mailingType) ? messages.streetAddress : messages.poBoxNumber}
                fieldName="street"
                warn
                optional
                readOnly={readOnly}
              /> 
              <TextFieldForm
                label={messages.city}
                fieldName="city"
                warn
                optional
                readOnly={readOnly}
              /> 
              <CountryField
                label={messages.country}
                fieldName="country"
                values={countries}
                initialValue={country}
                warn
                optional
                readOnly={readOnly}
              /> 
              <TextFieldForm
                label={messages.zipCode}
                fieldName="zip_code"
                optional
                readOnly={readOnly}
              />
            </GridRow>
            <GridRow columns={4}>
                  <TextFieldForm
                    label={messages.telephone}
                    fieldName="mailing_telephone"
                    warn
                    optional
                    readOnly={readOnly}
                    validation={[phoneNumber]}
                  />
                
                  <TextFieldForm
                    label={messages.fax}
                    fieldName="mailing_fax"
                    optional
                    readOnly={readOnly}
                  />
                
                  <TextFieldForm
                    label={messages.website}
                    fieldName="website"
                    validation={[url]}
                    optional
                    readOnly={readOnly}
                  />
               
                  <TextFieldForm
                    label={messages.organizationEmail}
                    fieldName="org_email"
                    validation={[email]}
                    optional
                    readOnly={readOnly}
                    textFieldProps={{
                      "type": "email"
                    }}
                  />
                </GridRow>  
            </GridColumn>
  </FormSection>);
};

PartnerProfileContactInfoAddress.propTypes = {
  readOnly: PropTypes.bool,
  country: PropTypes.string,
  countries: PropTypes.array,
  mailingType: PropTypes.string,
};

const selector = formValueSelector('partnerProfile');

export default connect(state => ({
  countries: selectNormalizedCountries(state),
  country: selector(state, 'mailing.address.country'),
  mailingType: selector(state, 'mailing.address.mailing_type'),
}), null)(PartnerProfileContactInfoAddress);
