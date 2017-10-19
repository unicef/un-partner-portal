import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';

const messages = {
  internetAccess: 'Does the organization have reliable access to internet in all of its ' +
              'operations?',
  explenation: 'Please explain how communication is done with non-connected operations',
};

const PartnerProfileContactInfoConnectivity = (props) => {
  const { hasInternetAccess, readOnly } = props;

  return (
    <FormSection name="connectivity">
      <Grid container direction="column" spacing={16}>
        <Grid item >
          <RadioForm
            fieldName="connectivity"
            label={messages.internetAccess}
            values={BOOL_VAL}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        {visibleIfNo(hasInternetAccess) && <Grid item >
          <TextFieldForm
            label={messages.explenation}
            fieldName="connectivity_excuse"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        }
      </Grid>

    </FormSection>
  );
};

PartnerProfileContactInfoConnectivity.propTypes = {
  /**
   * value of legal name change field to determine if former legal name field have to be displayed
   */
  hasInternetAccess: PropTypes.bool,
  readOnly: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasInternetAccess: selector(state, 'mailing.connectivity.connectivity'),
  }),
)(PartnerProfileContactInfoConnectivity);

