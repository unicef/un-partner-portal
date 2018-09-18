import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithTooltip from '../../common/buttonWithTooltip';

const messages = {
  text: 'Send',
  tooltip: 'In order for this direct selection/retention to become active, it must be sent to the focal point for publication.',
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
