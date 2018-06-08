import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const messages = {
  text: 'Publish',
};

const PublishCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <Button
      raised
      color="accent"
      onClick={handleClick}
    >
      {messages.text}
    </Button>
  );
};

PublishCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default PublishCfeiButton;
