import React from 'react';
import { reduxForm } from 'redux-form';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import { email } from '../../../../../helpers/validation';
import TextFieldForm from '../../../../forms/textFieldForm';
import FileForm from '../../../../forms/fileForm';
import PaddedContent from '../../../../common/paddedContent';
import SingleFlagSummaryHeader from './singleFlagSummaryHeader';

const messages = {
  comments: 'Comments',
  commentsHolder: 'Enter additional details...',
  contact: 'Contact person (optional)',
  contactHolder: 'Name and last name...',
  telephone: 'Telephone (optional)',
  telephoneHolder: 'Enter telephone...',
  email: 'E-mail (optional)',
  emailHolder: 'Enter e-mail...',
  attachment: 'Attachment (optional)',
  valid: 'This flag is no longer valid',
};

const SingleFlagSummary = (props) => {
  const { flag } = props;
  return (
    <form>
      <SingleFlagSummaryHeader flag={flag} />
      <PaddedContent>
        <GridColumn>
          <TextFieldForm
            label={messages.comments}
            placeholder={messages.commentsHolder}
            fieldName="comment"
            readOnly
          />
          <GridRow columns={3} align="flex-end">
            <TextFieldForm
              label={messages.contact}
              placeholder={messages.contactHolder}
              fieldName="contact_person"
              readOnly
            />
            <TextFieldForm
              label={messages.telephone}
              placeholder={messages.telephoneHolder}
              fieldName="contact_phone"
              readOnly
            />
            <TextFieldForm
              label={messages.email}
              placeholder={messages.emailHolder}
              fieldName="contact_email"
              validation={[email]}
              readOnly
            />
          </GridRow>
          <FileForm
            label={messages.attachment}
            fieldName="attachment"
            readOnly
          />
          <Divider />
        </GridColumn>
      </PaddedContent>

    </form >
  );
};

SingleFlagSummary.propTypes = {
  flag: PropTypes.object,
};

const formSingleFlagSummary = reduxForm({
})(SingleFlagSummary);

export default formSingleFlagSummary;
