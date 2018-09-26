import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import { BOOL_VAL } from '../../../../helpers/formHelper';
import TextFieldForm from '../../../forms/textFieldForm';
import ArrayForm from '../../../forms/arrayForm';
import GridRow from '../../../common/grid/gridRow';
import GridColumn from '../../../common/grid/gridColumn';
import { email, phoneNumber } from '../../../../helpers/validation';
import CustomGridColumn from '../../../common/grid/customGridColumn';

const messages = {
  fullname: 'Full name',
  jobTitle: 'Job Title/Position',
  telephone: 'Telephone',
  mobile: 'Mobile (optional)',
  fax: 'Fax (optional)',
  email: 'Email',
};

const authorisedOfficerForm = (head, index, readOnly) => (
  <CustomGridColumn>
    <GridRow columns={3}>
      <TextFieldForm
        label={messages.fullname}
        fieldName={`${head}.fullname`}
        readOnly={index === 0 || readOnly}
      />
      <TextFieldForm
        label={messages.jobTitle}
        fieldName={`${head}.job_title`}
        optional
        readOnly={readOnly}
      />
      <TextFieldForm
        label={messages.telephone}
        fieldName={`${head}.telephone`}
        validation={[phoneNumber]}
        optional
        readOnly={readOnly}
      />
    </GridRow>
    <GridRow columns={3}>
      <TextFieldForm
        label={messages.mobile}
        fieldName={`${head}.mobile`}
        validation={[phoneNumber]}
        optional
        readOnly={readOnly}
      />
      <TextFieldForm
        label={messages.fax}
        fieldName={`${head}.fax`}
        optional
        readOnly={readOnly}
      />
      <TextFieldForm
        label={messages.email}
        fieldName={`${head}.email`}
        validation={[email]}
        readOnly
      />
    </GridRow>
    <GridRow columns={3}>
      <RadioForm
        fieldName={`${head}.authorized`}
        values={BOOL_VAL}
        label="Authorised Officer?"
        readOnly={readOnly}
      />
      <RadioForm
        fieldName={`${head}.board_member`}
        values={BOOL_VAL}
        label="Member of the Board of Directors?"
        readOnly={readOnly}
      />
    </GridRow>
  </CustomGridColumn>
);

const PartnerProfileContactInfoHeadOrganization = (props) => {
  const { readOnly } = props;

  return (<FormSection name="org_head">
    <ArrayForm
      limit={15}
      initial
      label={messages.officers}
      fieldName="organisation_heads"
      outerField={(officer, index) => authorisedOfficerForm(officer, index, readOnly)}
      readOnly={readOnly}
    />
  </FormSection>
  );
};

PartnerProfileContactInfoHeadOrganization.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfoHeadOrganization;
