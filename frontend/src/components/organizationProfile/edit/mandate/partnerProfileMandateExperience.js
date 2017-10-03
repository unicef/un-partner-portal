import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import ExperienceSectorForm from './experienceSectorForm';

const PartnerProfileMandateExperience = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="experience">
      <Grid item>
        <ExperienceSectorForm />
      </Grid>
    </FormSection>
  );
};

PartnerProfileMandateExperience.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateExperience;
