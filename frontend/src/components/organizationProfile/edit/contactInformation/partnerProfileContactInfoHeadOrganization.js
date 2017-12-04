import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  fullname: 'Full name',
  jobTitle: 'Job Title/Position',
  telephone: 'Telephone',
  mobile: 'Mobile (optional)',
  fax: 'Fax (optional)',
  email: 'Email',
};

const PartnerProfileContactInfoHeadOrganization = (props) => {
  const { readOnly } = props;

  return (<FormSection name="org_head">
    <Grid container direction="row">
      <Grid item sm={4} xs={12}>
        <TextFieldForm
          label={messages.fullname}
          fieldName="fullname"
          readOnly
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <TextFieldForm
          label={messages.jobTitle}
          fieldName="job_title"
          optional
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <TextFieldForm
          label={messages.telephone}
          fieldName="telephone"
          optional
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
    <Grid container direction="row">
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label={messages.mobile}
          fieldName="mobile"
          optional
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label={messages.fax}
          fieldName="fax"
          optional
          readOnly={readOnly}
        />
      </Grid>
      <Grid item sm={3} xs={12}>
        <TextFieldForm
          label={messages.email}
          fieldName="email"
          readOnly
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
