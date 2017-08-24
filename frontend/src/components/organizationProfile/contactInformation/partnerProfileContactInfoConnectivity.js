import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
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


const PartnerProfileContactInfoConnectivity = (props) => {
  const { hasInternetAccess } = props;
  return (
    <FormSection name="connectivity">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName="hasInternetAccess"
              label={'Does the organiation have reliable access to internet in all of its' +
              'operations?'}
              values={BOOL_VAL}
              optional
              warn
            />
          </Grid>
          {hasInternetAccess === 'no' && <Grid item >
            <TextFieldForm
              label="Please explain how communication is done with non-connected operations"
              placeholder="200 character maximum"
              fieldName="communications"
              textFieldProps={{
                inputProps: {
                  maxLength: '200',
                },
              }}
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

PartnerProfileContactInfoConnectivity.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  hasInternetAccess: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasInternetAccess: selector(state, 'contactInfo.connectivity.hasInternetAccess'),
  }),
)(PartnerProfileContactInfoConnectivity);

