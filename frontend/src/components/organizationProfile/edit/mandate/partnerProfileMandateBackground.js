import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import TextFieldForm from '../../../forms/textFieldForm';

const PartnerProfileMandateBackground = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="background">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <TextFieldForm
              label={'Briefly state the background and rationale for the establishment of the ' +
            'organization'}
              placeholder="Please limit your response to 400 characters"
              fieldName="background_and_rationale"
              textFieldProps={{
                inputProps: {
                  maxLength: '400',
                },
              }}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Briefly state the mandate and mission of the organization"
              placeholder="Please limit your response to 400 characters"
              fieldName="mandate_and_mission"
              textFieldProps={{
                inputProps: {
                  maxLength: '400',
                },
              }}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};


PartnerProfileMandateBackground.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateBackground;
