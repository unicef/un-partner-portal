import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import TextFieldForm from '../../../forms/textFieldForm';

const PartnerProfileContactInfoHeadOrganization = (props) => {
  const { readOnly } = props;

  return (<FormSection name="org_head">
    <Grid container direction="row">
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="First Name"
          placeholder=""
          fieldName="first_name"
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="Last Name"
          placeholder=""
          fieldName="last_name"
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="Job Title/Position"
          placeholder=""
          fieldName="job_title"
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="Telephone"
          placeholder=""
          fieldName="telephone"
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
    <Grid container direction="row">
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="Mobile (optional)"
          placeholder=""
          fieldName="mobile"
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label="Fax (optional)"
          placeholder=""
          fieldName="fax"
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextFieldForm
          label="Email"
          placeholder=""
          fieldName="email"
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
  </FormSection>
  );
};

PartnerProfileContactInfoHeadOrganization.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfoHeadOrganization;
