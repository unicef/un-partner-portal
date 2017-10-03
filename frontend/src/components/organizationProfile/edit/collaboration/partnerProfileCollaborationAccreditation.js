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

const PartnerProfileCollaborationAccreditation = (props) => {
  const { readOnly } = props;

  return (<FormSection name="accreditation">
    <Grid item>
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <SelectForm
            fieldName="donors"
            label="Please select the type of donors that fund your agency"
            values={DONORS_MENU}
            infoIcon
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

PartnerProfileCollaborationAccreditation.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaborationAccreditation;
