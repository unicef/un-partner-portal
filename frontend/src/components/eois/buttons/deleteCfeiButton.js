import React from 'react';
import PropTypes from 'prop-types';
import Delete from 'material-ui-icons/Delete';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Delete',
};

const DeleteCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Delete />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

DeleteCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default DeleteCfeiButton;
