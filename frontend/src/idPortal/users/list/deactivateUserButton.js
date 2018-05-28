import React from 'react';
import PropTypes from 'prop-types';
import IconWithTextButton from '../../../components/common/iconWithTextButton';

const messages = {
  deactivate: 'Deactivate User\'s Account',
  activate: 'Activate User\'s Account',
};

const DeactivateUserButton = (props) => {
  const { handleClick, isActive } = props;
  
  return (
    <IconWithTextButton
      text={isActive ? messages.deactivate : messages.activate}
      onClick={handleClick}
    />
  );
};

DeactivateUserButton.propTypes = {
  handleClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export default DeactivateUserButton;
