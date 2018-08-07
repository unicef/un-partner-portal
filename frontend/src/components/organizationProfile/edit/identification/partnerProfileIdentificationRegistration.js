import R from 'ramda';
import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router';
import { visibleIfYes, visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import ArrayForm from '../../../forms/arrayForm';
import FileForm from '../../../forms/fileForm';
import YearFieldForm from '../../../forms/yearFieldForm';
import TextFieldForm from '../../../forms/textFieldForm';
import DatePickerForm from '../../../forms/datePickerForm';
import { PLACEHOLDERS } from '../../../../helpers/constants';

const messages = {
  yearEstablishmentHq: 'Year of establishment in country of operation',
  yearEstablishment: 'Year of establishment in country',
  haveGovDoc: 'Does the Organization have a Governing Document?',
  governingDoc: 'Governing Document',
  registrationCountry: 'Is organization registered to operate in the country of origin?',
  registrationCountryHq: 'Is the organization registered to operate in the country?',
  date: 'Registration Date',
  expireDate: 'Expiration Date',
  number: 'Registration number (If applicable)',
  document: 'Registration Document',
  comment: 'Please comment',
  govDocTooltip: 'Governing document: is a formal document with information about the structure ' +
  'and governance of an organization, outlining the purposes of the organization and how it will ' +
  'be run. A governing document may come in the form of a trust deed, constitution, memorandum ' +
  'and articles of association, or another formal, legal document.',
  registeringAuthority: 'Name of registering authority',
};

const GoverningDocument = readOnly => (member, index, fields) => (<Grid container>
  <Grid item sm={12} xs={12}>
    <FileForm
      fieldName={`${member}.document`}
      formName="partnerProfile"
      sectionName="identification.registration"
      label={messages.governingDoc}
      warn
      optional
      readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
        || readOnly}
      infoText={messages.govDocTooltip}
    />
  </Grid>
</Grid>);

const RegistrationDocument = readOnly => (member, index, fields) => (<Grid item>
  <Grid container direction="row">
    <Grid item sm={4} xs={12}>
      <DatePickerForm
        fieldName={`${member}.issue_date`}
        label={messages.date}
        warn
        optional
        placeholder={PLACEHOLDERS.provide}
        readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
          || readOnly}
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <TextFieldForm
        label={messages.registeringAuthority}
        fieldName={`${member}.issuing_authority`}
        optional
        placeholder={PLACEHOLDERS.provide}
        readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
          || readOnly}
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <TextFieldForm
        label={messages.number}
        fieldName={`${member}.registration_number`}
        optional
        placeholder={PLACEHOLDERS.provide}
        readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
          || readOnly}
      />
    </Grid>
  </Grid>
  <Grid container direction="row">
    <Grid item sm={4} xs={12}>
      <DatePickerForm
        fieldName={`${member}.expiry_date`}
        label={messages.expireDate}
        warn
        optional
        placeholder={PLACEHOLDERS.provide}
        readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
          || readOnly}
      />
    </Grid>
    <Grid item sm={8} xs={12}>
      <FileForm
        fieldName={`${member}.document`}
        formName="partnerProfile"
        sectionName="identification.registration"
        label={messages.document}
        warn
        optional
        readOnly={(R.is(Boolean, fields.get(index).editable) && !fields.get(index).editable)
          || readOnly}
      />
    </Grid>
  </Grid>
</Grid>);

const PartnerProfileIdentificationRegistration = (props) => {
  const { isRegistered, readOnly, isCountryProfile, hasGovDoc } = props;

  return (
    <FormSection name="registration">
      <Grid container direction="column">
        <Grid item>
          <YearFieldForm
            fieldName="year_establishment"
            label={isCountryProfile
              ? messages.yearEstablishment
              : messages.yearEstablishmentHq}
            warn
            placeholder={PLACEHOLDERS.provide}
            optional
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <RadioForm
            fieldName="have_governing_document"
            label={messages.haveGovDoc}
            values={BOOL_VAL}
            warn
            optional
            readOnly={readOnly}
          />
        </Grid>
        {visibleIfYes(hasGovDoc)
              && <Grid item>
                <ArrayForm
                  label={messages.sectorsAndSpecialization}
                  limit={10}
                  fieldName="governing_documents"
                  initial
                  readOnly={readOnly}
                  outerField={GoverningDocument(readOnly)}
                />
              </Grid>}
        {visibleIfNo(hasGovDoc) && <Grid item>
          <TextFieldForm
            label={messages.comment}
            fieldName="missing_governing_document_comment"
            warn
            optional
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '50',
                },
              },
            }}
            readOnly={readOnly}
          />
        </Grid>}
        <Grid item>
          <RadioForm
            fieldName="registered_to_operate_in_country"
            label={isCountryProfile
              ? messages.registrationCountry
              : messages.registrationCountryHq}
            values={BOOL_VAL}
            warn
            optional
            readOnly={readOnly}
          />
        </Grid>
        {visibleIfYes(isRegistered)
         && <Grid item>
           <ArrayForm
             label={messages.sectorsAndSpecialization}
             limit={10}
             fieldName="registration_documents"
             initial
             readOnly={readOnly}
             outerField={RegistrationDocument(readOnly)}
           />
         </Grid>}
        {visibleIfNo(isRegistered) && <Grid item>
          <TextFieldForm
            label={messages.comment}
            fieldName="missing_registration_document_comment"
            warn
            optional
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '50',
                },
              },
            }}
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
  isCountryProfile: PropTypes.bool.isRequired,
};

const selector = formValueSelector('partnerProfile');
const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.data.partners);

  return {
    isCountryProfile: partner ? (partner.is_hq || false) : false,
    isRegistered: selector(state, 'identification.registration.registered_to_operate_in_country'),
    hasGovDoc: selector(state, 'identification.registration.have_governing_document'),
  };
}, null)(PartnerProfileIdentificationRegistration);

export default withRouter(connected);
