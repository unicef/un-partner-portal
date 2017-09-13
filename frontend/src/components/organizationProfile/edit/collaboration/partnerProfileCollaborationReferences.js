import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import SelectForm from '../../../forms/selectForm';


const DONORS_MENU = [
  {
    value: '1',
    label: 'Individuals',
  },
  {
    value: '2',
    label: 'United Nations Agency',
  },
  {
    value: '3',
    label: 'Governments',
  },
];

const PartnerProfileCollaborationReferences = (props) => {
  const { readOnly } = props;
  return (
    <FormSection name="references">
      <Grid item>
        <SelectForm
          fieldName="donors"
          label="Please select the type of donors that fund your agency"
          values={DONORS_MENU}
          onFieldChange={this.handleDonorFieldChange}
          optional
          warn
          readOnly={readOnly}
        />
      </Grid>
    </FormSection>
  );
};

PartnerProfileCollaborationReferences.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaborationReferences;
