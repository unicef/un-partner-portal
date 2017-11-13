import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const messages = {
  text: 'Finalize',
};

const EditCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <Button
      color="accent"
      raised
      onClick={handleClick}
    >
      {messages.text}
    </Button>
  );
};

EditCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default EditCfeiButton;
