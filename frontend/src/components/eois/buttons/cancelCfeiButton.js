import React from 'react';
import PropTypes from 'prop-types';
import Cancel from 'material-ui-icons/Cancel';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Cancel',
};

const CancelCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Cancel />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

CancelCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default CancelCfeiButton;
