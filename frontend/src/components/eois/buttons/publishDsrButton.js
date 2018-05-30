import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/button';

const messages = {
  text: 'Send',
};

const EditCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <Button
      onClick={handleClick}
    />
  );
};

EditCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default EditCfeiButton;
