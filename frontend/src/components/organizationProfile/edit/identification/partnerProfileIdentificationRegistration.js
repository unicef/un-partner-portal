import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { visibleIfYes, visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import TextFieldForm from '../../../forms/textFieldForm';
import DatePickerForm from '../../../forms/datePickerForm';

const messages = {
  yearEstablishmentHq: 'Year of establishment in country of origin',
  yearEstablishment: 'Year of establishment in country',
  haveGovDoc: 'Does the Organization have a Governing Document?',
  governingDoc: 'Governing Document',
  registrationCountryHq: 'Is the organization registered in the country of origin?',
  registrationCountry: 'Is the organization registered to operate in the country?',
  date: 'Registration Date',
  number: 'Registration number (If applicable)',
  document: 'Registration Document',
  comment: 'Please comment',
};

const PartnerProfileIdentificationRegistration = (props) => {
  const { isRegistered, readOnly, isCountryProfile, hasGovDoc } = props;

  return (
    <FormSection name="registration">
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={4} xs={12}>
              <TextFieldForm
                fieldName="year_establishment"
                label={isCountryProfile
                  ? messages.yearEstablishment
                  : messages.yearEstablishmentHq}
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RadioForm
                fieldName="have_gov_doc"
                label={messages.haveGovDoc}
                values={BOOL_VAL}
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            {visibleIfYes(hasGovDoc)
              && <Grid item sm={4} xs={12}>
                <FileForm
                  fieldName="gov_doc"
                  formName="partnerProfile"
                  sectionName="identification.registration"
                  label={messages.governingDoc}
                  optional
                  warn
                  readOnly={readOnly}
                />
              </Grid>}
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="registration_to_operate_in_country"
            label={isCountryProfile
              ? messages.registrationCountry
              : messages.registrationCountryHq}
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        {visibleIfYes(isRegistered)
            && <Grid item>
              <Grid container direction="row">
                <Grid item sm={4} xs={12}>
                  <DatePickerForm
                    fieldName="registration_date"
                    label={messages.date}
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextFieldForm
                    label={messages.number}
                    fieldName="registration_number"
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FileForm
                    fieldName="registration_doc"
                    formName="partnerProfile"
                    sectionName="identification.registration"
                    label={messages.document}
                    optional
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>}
        {visibleIfNo(isRegistered) && <Grid item sm={6} xs={12}>
          <TextFieldForm
            label={messages.comment}
            fieldName="registration_comment"
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>}
      </Grid>
    </FormSection>
  );
};

PartnerProfileIdentificationRegistration.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  isRegistered: PropTypes.bool,
  readOnly: PropTypes.bool,
  hasGovDoc: PropTypes.bool,
  isCountryProfile: PropTypes.object.isRequired,
};

const selector = formValueSelector('partnerProfile');
const ConnectedPartnerProfileIdentificationRegistration = connect(
  state => ({
    isRegistered: selector(state, 'identification.registration.registration_to_operate_in_country'),
    isCountryProfile: selector(state, 'identification.registration.hq'),
    hasGovDoc: selector(state, 'identification.registration.have_gov_doc'),
  }),
)(PartnerProfileIdentificationRegistration);

export default ConnectedPartnerProfileIdentificationRegistration;
