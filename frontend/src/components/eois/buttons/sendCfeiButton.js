import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithTooltip from '../../common/buttonWithTooltip';

const messages = {
  text: 'Send',
  tooltip: 'In order to publish this CFEI, you need to send it to Advanced Editor for acceptance.',
};

const SendCfeiButton = (props) => {
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

SendCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default SendCfeiButton;
