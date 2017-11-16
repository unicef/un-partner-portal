import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedCountries } from '../../../../store';
import { url, email } from '../../../../helpers/validation';

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
  const { readOnly, countries, mailingType } = props;

  return (<FormSection name="address">
    <Grid item>
      <Grid container direction="column" spacing={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="mailing_type"
            label={messages.mailingType}
            values={MAILING_TYPE_VALUES}
            renderTextSelection
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label={isStreetAddress(mailingType) ? messages.streetAddress : messages.poBoxNumber}
                fieldName="street"
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label={messages.city}
                fieldName="city"
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <SelectForm
                label={messages.country}
                fieldName="country"
                values={countries}
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label={messages.zipCode}
                fieldName="zip_code"
                optional
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <Grid container direction="row">
                <Grid item sm={3} xs={12}>
                  <TextFieldForm
                    label={messages.telephone}
                    fieldName="telephone"
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextFieldForm
                    label={messages.fax}
                    fieldName="fax"
                    optional
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextFieldForm
                    label={messages.website}
                    fieldName="website"
                    validation={[url]}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <TextFieldForm
                    label={messages.organizationEmail}
                    fieldName="org_email"
                    validation={[email]}
                    readOnly={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </FormSection>);
};

PartnerProfileContactInfoAddress.propTypes = {
  readOnly: PropTypes.bool,
  countries: PropTypes.array.isRequired,
  mailingType: PropTypes.string,
};

const selector = formValueSelector('partnerProfile');

export default connect(state => ({
  countries: selectNormalizedCountries(state),
  mailingType: selector(state, 'mailing.address.mailing_type'),
}), null)(PartnerProfileContactInfoAddress);
