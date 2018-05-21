import React from 'react';
import PropTypes from 'prop-types';
import IconWithTextButton from '../../../components/common/iconWithTextButton';

const messages = {
  text: 'Deactivate User\'s Account',
};

const DeactivateUserButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      text={messages.text}
      onClick={handleClick}
    />
  );
};

DeactivateUserButton.propTypes = {
  handleClick: PropTypes.func,
};

export default DeactivateUserButton;
