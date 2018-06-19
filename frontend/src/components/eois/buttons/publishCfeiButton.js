import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Publish',
  tooltipInfo: 'Update Application Deadline date to publish this CFEI',
};

const PublishCfeiButton = (props) => {
  const { handleClick, disabled } = props;
  return disabled ?
    <ButtonWithTooltipEnabled
      name="publish"
      text={messages.text}
      tooltipText={messages.tooltipInfo}
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
  disabled: PropTypes.string,
};

export default PublishCfeiButton;
