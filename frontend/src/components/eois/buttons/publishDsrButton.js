import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Publish',
  tooltipInfo: 'You can\'t publish this DS/R until selected partner get verified',
};

const PublishDsrButton = (props) => {
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

PublishDsrButton.propTypes = {
  handleClick: PropTypes.func,
  disabled: PropTypes.string,
};

export default PublishDsrButton;
