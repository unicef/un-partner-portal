import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';


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

const PartnerProfileContactInfoOfficials = (props) => {
  const { readOnly } = props;

  return (<FormSection name="authorizedOfficials">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="hasBoD"
            label="Does your Organization have a Board of Directors?"
            values={BOOL_VAL}
            readOnly={readOnly}
          />
        </Grid>

        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="isAuthorisedOfficer"
                label="Authorised Officer?"
                values={BOOL_VAL}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
                readOnly={readOnly}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
  );
};

PartnerProfileContactInfoOfficials.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfoOfficials;
