import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Publish',
};

const PublishCfeiButton = (props) => {
  const { handleClick, disabled, tooltipInfo } = props;
  return disabled ?
    <ButtonWithTooltipEnabled
      name="publish"
      text={messages.text}
      tooltipText={tooltipInfo}
      onClick={handleClick}
      disabled={disabled}
    />
    : <Button
      raised
      color="accent"
      onClick={handleClick}
    >
      {messages.text}
    </Button>;
};

PublishCfeiButton.propTypes = {
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
  tooltipInfo: PropTypes.string,
};

export default PublishCfeiButton;
