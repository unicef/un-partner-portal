import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Add new verification',
};

const AddNewVerificationButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Add />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

AddNewVerificationButton.propTypes = {
  handleClick: PropTypes.func,
};

export default AddNewVerificationButton;
