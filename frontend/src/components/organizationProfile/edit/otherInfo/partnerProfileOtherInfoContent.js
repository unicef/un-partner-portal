import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import CheckboxForm from '../../../forms/checkboxForm';
import FileForm from '../../../forms/fileForm';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  otherInfo: 'Other information the organization may wish to share? (optional)',
  docs: 'Upload up to 3 documents that may be useful',
  confirm: `The organization confirms that the information provided in the profile is accurate to the best of its knowledge,
   and understands that any misrepresentations, falsifications or material omissions in the profile, 
   whenever discovered, may result in disqualification from or termination of partnership with the UN.`,
  orgLogo: 'Organization Logo',
  declaration: 'Registration Declaration',
};

const PartnerProfileOtherInfoContent = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="info">
      <GridColumn>
        <TextFieldForm
          label={messages.otherInfo}
          fieldName="info_to_share"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
          optional
          readOnly={readOnly}
        />
        <FileForm
          formName="partnerProfile"
          sectionName="other_info.info"
          label={messages.docs}
          fieldName="other_doc_1"
          optional
          readOnly={readOnly}
        />
        <FileForm
          formName="partnerProfile"
          sectionName="other_info.info"
          fieldName="other_doc_2"
          optional
          readOnly={readOnly}
        />
        <FileForm
          formName="partnerProfile"
          sectionName="other_info.info"
          fieldName="other_doc_3"
          optional
          readOnly={readOnly}
        />
        <FileForm
          formName="partnerProfile"
          sectionName="other_info.info"
          label={messages.orgLogo}
          fieldName="org_logo"
          optional
          readOnly={readOnly}
        />
        <FileForm
          formName="partnerProfile"
          sectionName="other_info.registration_declaration"
          label={messages.declaration}
          fieldName="registration_declaration"
          optional
          readOnly
        />
        <CheckboxForm
          label={messages.confirm}
          fieldName="confirm_data_updated"
          warn
          optional
          readOnly={readOnly}
        />
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileOtherInfoContent.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileOtherInfoContent;
