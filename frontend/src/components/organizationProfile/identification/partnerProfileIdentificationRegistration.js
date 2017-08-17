import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';

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
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <SelectForm
                fieldName="yearOfEstablishment"
                label="Year of Establishment in Country of Origin"
                values={YEAR_MENU}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hasGoverningDocument"
                label="Does the Organization have a Governing Document?"
                values={BOOL_VAL}
                onFieldChange={this.handleGoverningFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Governing Document"
                placeholder="Upload File"
                fieldName="governingDocument"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="isRegistered"
            label="Is the Organization Registered in the Country of Origin?"
            values={BOOL_VAL}
            onFieldChange={this.handleRegistrationFieldChange}
          />
        </Grid>
        {isRegistered === 'yes' &&
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <SelectForm
                fieldName="registrationDate"
                label="Registration Date"
                values={YEAR_MENU}
                infoIcon
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Registration Number (optional)"
                placeholder=""
                fieldName="registrationNumber"
                optional
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Registration Document"
                placeholder="Upload File"
                fieldName="registrationDocument"
              />
            </Grid>
          </Grid>
        </Grid>}
        {isRegistered === 'no' &&
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Please explain the registration related circumstances"
              placeholder="Provide a comment"
              fieldName="registrationExplanation"
            />
          </Grid>
        }
      </Grid>
    </Grid>
  );
};

PartnerProfileIdentificationRegistration.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  isRegistered: PropTypes.bool,
};

const selector = formValueSelector('registration');
const ConnectedPartnerProfileIdentificationRegistration = connect(
  state => ({
    legalNameChange: selector(state, 'isRegistered'),
  }),
)(PartnerProfileIdentificationRegistration);

export default ConnectedPartnerProfileIdentificationRegistration;
