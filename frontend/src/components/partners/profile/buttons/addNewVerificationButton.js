import React from 'react';
import PropTypes from 'prop-types';
import Cancel from 'material-ui-icons/Cancel';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Add new verification',
};

const addNewVerification = (id) => {
  console.log(`Add new verification: ${id}`);
};

const AddNewVerificationButton = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<Cancel />}
      text={messages.text}
      onClick={() => addNewVerification(id)}
    />
  );
};

AddNewVerificationButton.propTypes = {
  id: PropTypes.string,
};

export default AddNewVerificationButton;
