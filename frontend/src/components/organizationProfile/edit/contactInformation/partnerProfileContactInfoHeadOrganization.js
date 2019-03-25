import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  hqHeads: 'HQ - Head(s) of Organization',
  heads: 'Country office - Head(s) of Organization',
};

const authorisedOfficerForm = (head, index, readOnly, isHq) => (
  <CustomGridColumn>
    <GridRow columns={3}>
      <TextFieldForm
        label={messages.fullname}
        fieldName={`${head}.fullname`}
        readOnly={readOnly}
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
        readOnly={readOnly}
        textFieldProps={{
          "type": "email"
        }}
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
  const { readOnly, hqOrgHeads } = props;

  return (<FormSection name="org_head">
    <GridColumn>
      {hqOrgHeads ?
        <ArrayForm
          limit={15}
          initial
          label={messages.hqHeads}
          fieldName="hq_organisation_heads"
          outerField={(officer, index) => authorisedOfficerForm(officer, index, true)}
          readOnly
        />
        : null}
      <ArrayForm
        limit={15}
        initial
        label={hqOrgHeads && messages.heads}
        fieldName="organisation_heads"
        outerField={(officer, index) => authorisedOfficerForm(officer, index, readOnly, !hqOrgHeads)}
        readOnly={readOnly}
      />
    </GridColumn>
  </FormSection>
  );
};


PartnerProfileContactInfoHeadOrganization.propTypes = {
  readOnly: PropTypes.bool,
  hqOrgHeads: PropTypes.array,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hqOrgHeads: selector(state, 'mailing.org_head.hq_organisation_heads'),
  }),
)(PartnerProfileContactInfoHeadOrganization);
