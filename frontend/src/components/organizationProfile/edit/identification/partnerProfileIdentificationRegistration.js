import R from 'ramda';
import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router';
import { visibleIfYes, visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import YearFieldForm from '../../../forms/yearFieldForm';
import TextFieldForm from '../../../forms/textFieldForm';
import DatePickerForm from '../../../forms/datePickerForm';

const messages = {
  yearEstablishmentHq: 'Year of establishment in country of operation',
  yearEstablishment: 'Year of establishment in country',
  haveGovDoc: 'Does the Organization have a Governing Document?',
  governingDoc: 'Governing Document',
  registrationCountry: 'Is organization registered to operate in the country of origin?',
  registrationCountryHq: 'Is the organization registered to operate in the country?',
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
              <YearFieldForm
                fieldName="year_establishment"
                label={isCountryProfile
                  ? messages.yearEstablishment
                  : messages.yearEstablishmentHq}
                warn
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RadioForm
                fieldName="have_gov_doc"
                label={messages.haveGovDoc}
                values={BOOL_VAL}
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
                    warn
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextFieldForm
                    label={messages.number}
                    fieldName="registration_number"
                    optional
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FileForm
                    fieldName="registration_doc"
                    formName="partnerProfile"
                    sectionName="identification.registration"
                    label={messages.document}
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
const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.data.partners);

  return {
    isCountryProfile: partner ? partner.is_hq : false,
    isRegistered: selector(state, 'identification.registration.registration_to_operate_in_country'),
    hasGovDoc: selector(state, 'identification.registration.have_gov_doc'),
  };
}, null)(PartnerProfileIdentificationRegistration);

export default withRouter(connected);
