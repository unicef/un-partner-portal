import React from 'react';
import PropTypes from 'prop-types';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Verify Profile',
};

const AddNewVerificationButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<VerifiedUser />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

AddNewVerificationButton.propTypes = {
  handleClick: PropTypes.func,
};

export default AddNewVerificationButton;
