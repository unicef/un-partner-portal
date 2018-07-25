import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import Grid from 'material-ui/Grid';
import CountryField from '../forms/fields/projectFields/locationField/countryField';
import YearFieldForm from '../forms/yearFieldForm';
import TextFieldForm from '../forms/textFieldForm';
import RadioForm from '../forms/radioForm';
import { visibleIfYes, visibleIfNo, BOOL_VAL } from '../../helpers/formHelper';
import { PLACEHOLDERS } from '../../helpers/constants';
import FileForm from '../forms/fileForm';
import DatePickerForm from '../forms/datePickerForm';

const messages = {
  countryOfOrigin: 'Country Of Origin',
  yearOfEstablishment: 'Year of establishment in country of origin',
  selectYear: 'Select year',
  registrationCountry: 'Is organization registered to operate in the country of origin?',
  registrationDoc: 'Does the organization have Registration Document?',
  date: 'Registration Date',
  number: 'Registration number (If applicable)',
  document: 'Please upload Registration Document',
  comment: 'Comment',
  name: 'Name of registering authority',
  expireDate: 'Expiration date',
  govDocTooltip: 'Governing document: is a formal document with information about the structure ' +
  'and governance of an organization, outlining the purposes of the organization and how it will ' +
  'be run. A governing document may come in the form of a trust deed, constitution, memorandum ' +
  'and articles of association, or another formal, legal document.',
  haveGovDoc: 'Does the Organization have a Governing Document?',
  governingDoc: 'Please upload Governing Document',
  haveRefLetter: 'Does the organization have a letter o reference from a donor agency, government authority or community association?',
  referenceLetter: 'Please upload letter of reference',
};

const BasicInformation = (props) => {
  const { isRegistered, hasRegistrationDoc, hasGovDoc, hasRefLetter } = props;
  return (
    <Grid item>
      <Grid container direction="column" spacing={16}>
        <Grid item sm={6} xs={12}>
          <CountryField
            fieldName="json.legal.country_code_origin"
            label={messages.countryOfOrigin}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <YearFieldForm
            fieldName="json.legal.year_establishment"
            label={messages.yearOfEstablishment}
            placeholder={messages.selectYear}
          />
        </Grid>
        <Grid item>
          <RadioForm
            fieldName="json.legal.registration_to_operate_in_country"
            label={messages.registrationCountry}
            values={BOOL_VAL}
          />
        </Grid>
        {visibleIfYes(isRegistered)
            && <Grid item>
              <Grid container direction="row">
                <Grid item sm={4} xs={12}>
                  <DatePickerForm
                    fieldName="json.legal.registration_date"
                    label={messages.date}
                    placeholder={PLACEHOLDERS.provide}
                  />
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TextFieldForm
                    label={messages.number}
                    fieldName="json.legal.registration_number"
                    optional
                    placeholder={PLACEHOLDERS.provide}
                  />
                </Grid>
              </Grid>
              <Grid container direction="column">
                <Grid item>
                  <TextFieldForm
                    label={messages.name}
                    fieldName="json.legal.authority_name"
                    placeholder={PLACEHOLDERS.provide}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <DatePickerForm
                    fieldName="json.legal.expiration_date"
                    label={messages.expireDate}
                    optional
                    placeholder={PLACEHOLDERS.provide}
                  />
                </Grid>
                <Grid item>
                  <RadioForm
                    fieldName="json.legal.have_registration_doc"
                    label={messages.registrationDoc}
                    values={BOOL_VAL}
                  />
                </Grid>
                {visibleIfYes(hasRegistrationDoc) && <Grid item>
                  <FileForm
                    fieldName="json.legal.registration_doc"
                    formName="registration"
                    sectionName="json.legal.registration"
                    label={messages.document}
                  />
                </Grid>}
                {visibleIfNo(hasRegistrationDoc) && <Grid item>
                  <TextFieldForm
                    label={messages.comment}
                    fieldName="json.legal.registration_doc_comment"
                    placeholder={PLACEHOLDERS.provide}
                  />
                </Grid>}
              </Grid>
            </Grid>}
        {visibleIfNo(isRegistered) && <Grid item>
          <TextFieldForm
            label={messages.comment}
            fieldName="json.legal.registration_comment"
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '500',
                },
              },
            }}
          />
        </Grid>}
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="json.legal.have_gov_doc"
            label={messages.haveGovDoc}
            values={BOOL_VAL}
          />
        </Grid>
        {visibleIfYes(hasGovDoc) && <Grid item sm={6} xs={12}>
          <FileForm
            fieldName="gov_doc"
            formName="registration"
            sectionName="json.legal.registration"
            label={messages.governingDoc}
            infoText={messages.govDocTooltip}
          />
        </Grid>}
        {visibleIfNo(hasGovDoc) && <Grid item>
          <TextFieldForm
            label={messages.comment}
            fieldName="json.legal.gov_doc_comment"
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '500',
                },
              },
            }}
          />
        </Grid>}
        <Grid item>
          <RadioForm
            fieldName="json.legal.have_ref_letter"
            label={messages.haveRefLetter}
            values={BOOL_VAL}
          />
        </Grid>
        {visibleIfYes(hasRefLetter) && <Grid item sm={6} xs={12}>
          <FileForm
            fieldName="ref_letter"
            formName="registration"
            sectionName="json.legal.registration"
            label={messages.referenceLetter}
          />
        </Grid>}
        {visibleIfNo(hasRefLetter) && <Grid item>
          <TextFieldForm
            label={messages.comment}
            fieldName="json.legal.ref_letter_comment"
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '500',
                },
              },
            }}
          />
        </Grid>}
      </Grid>
    </Grid>
  );
};

BasicInformation.propTypes = {
  isRegistered: PropTypes.bool,
  hasRegistrationDoc: PropTypes.bool,
  hasGovDoc: PropTypes.bool,
  hasRefLetter: PropTypes.bool,
};

const selector = formValueSelector('registration');
const connectedBasicInformation = connect(
  state => ({
    isRegistered: selector(state, 'json.legal.registration_to_operate_in_country'),
    hasRegistrationDoc: selector(state, 'json.legal.have_registration_doc'),
    hasGovDoc: selector(state, 'json.legal.have_gov_doc'),
    hasRefLetter: selector(state, 'json.legal.have_ref_letter'),
  }),
)(BasicInformation);

export default connectedBasicInformation;