import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithTooltip from '../../common/buttonWithTooltip';

const messages = {
  text: 'Send',
  tooltip: 'In order to publish this DS/R, you need to send it to Advanced Editor for acceptance.',
};

const EditCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <ButtonWithTooltip
      name="send"
      text={messages.text}
      tooltipText={messages.tooltip}
      onClick={handleClick}
    />
  );
};

EditCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default EditCfeiButton;
