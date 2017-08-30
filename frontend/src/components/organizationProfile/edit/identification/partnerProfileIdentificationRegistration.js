import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import DatePickerForm from '../../../forms/datePickerForm';

const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

const YEAR_MENU = [
  {
    value: '2017',
    label: '2017',
  },
  {
    value: '2016',
    label: '2016',
  },
];

const PartnerProfileIdentificationRegistration = (props) => {
  const { isRegistered } = props;
  return (
    <FormSection name="registration">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={4} xs={12}>
                <SelectForm
                  fieldName="yearOfEstablishment"
                  label="Year of Establishment in Country of Origin"
                  placeholder="Select year"
                  values={YEAR_MENU}
                  optional
                  warn
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <RadioForm
                  fieldName="hasGoverningDocument"
                  label="Does the Organization have a Governing Document?"
                  values={BOOL_VAL}
                  optional
                  warn
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextFieldForm
                  label="Governing Document"
                  placeholder="Upload File"
                  fieldName="governingDocument"
                  optional
                  warn
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={4} xs={12}>
            <RadioForm
              fieldName="isRegistered"
              label="Is the Organization Registered in the Country of Origin?"
              values={BOOL_VAL}
              optional
              warn
            />
          </Grid>
          {isRegistered === 'yes' &&
            <Grid item>
              <Grid container direction="row">
                <Grid item sm={4} xs={12}>
                  <DatePickerForm
                    fieldName="registrationDate"
                    label="Registration Date"
                    placeholder="Provide Date"
                    optional
                    warn
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextFieldForm
                    label="Registration Number (if applicable)"
                    placeholder="-"
                    fieldName="registrationNumber"
                    optional
                    warn
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextFieldForm
                    label="Registration Document"
                    placeholder="Upload File"
                    fieldName="registrationDocument"
                    optional
                    warn
                  />
                </Grid>
              </Grid>
            </Grid>}
          {(!isRegistered || isRegistered === 'no') &&
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Please explain the registration related circumstances"
                placeholder="Provide a comment"
                fieldName="registrationExplanation"
                optional
                warn
              />
            </Grid>
          }
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileIdentificationRegistration.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  isRegistered: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
const ConnectedPartnerProfileIdentificationRegistration = connect(
  state => ({
    isRegistered: selector(state, 'identification.registration.isRegistered'),
  }),
)(PartnerProfileIdentificationRegistration);

export default ConnectedPartnerProfileIdentificationRegistration;
