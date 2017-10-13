import React from 'react';
import PropTypes from 'prop-types';
import Create from 'material-ui-icons/Create';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Edit',
};

const EditCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Create />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

EditCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default EditCfeiButton;
