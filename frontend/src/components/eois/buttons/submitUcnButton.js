import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const messages = {
  text: 'Submit',
};

const SubmitUcnButton = (props) => {
  const { handleClick } = props;
  return (<Button
    raised
    color="accent"
    onClick={handleClick}
  >
    {messages.text}
  </Button>);
};

SubmitUcnButton.propTypes = {
  handleClick: PropTypes.func,
};

export default SubmitUcnButton;
