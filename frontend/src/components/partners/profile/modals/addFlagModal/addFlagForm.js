import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import { email } from '../../../../../helpers/validation';
import TextFieldForm from '../../../../forms/textFieldForm';
import FileForm from '../../../../forms/fileForm';

const messages = {
  comments: 'Comments',
  commentsHolder: 'Enter additional details...',
  contact: 'Contact person (optional)',
  contactHolder: 'Full name...',
  telephone: 'Telephone (optional)',
  telephoneHolder: 'Enter telephone...',
  email: 'E-mail (optional)',
  emailHolder: 'Enter e-mail...',
  attachment: 'Attachment (optional)',
};

const AddVerification = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <TextFieldForm
          label={messages.comments}
          placeholder={messages.commentsHolder}
          fieldName="comment"
        />
        <TextFieldForm
          label={messages.contact}
          placeholder={messages.contactHolder}
          fieldName="contact_person"
          optional
        />
        <GridRow>
          <TextFieldForm
            label={messages.telephone}
            placeholder={messages.telephoneHolder}
            fieldName="contact_phone"
            optional
          />
          <TextFieldForm
            label={messages.email}
            placeholder={messages.emailHolder}
            fieldName="contact_email"
            validation={[email]}
            optional
          />
        </GridRow>
        <FileForm
          label={messages.attachment}
          fieldName="attachment"
          optional
        />
      </GridColumn>
    </form >
  );
};

AddVerification.propTypes = {
  /**
  * callback for form submit
  */
  handleSubmit: PropTypes.func.isRequired,
};

const formAddVerification = reduxForm({
  form: 'addFlag',
})(AddVerification);

export default formAddVerification;
