import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Publish',
  tooltipInfo: 'This DS/R cannot be published as partner selected does not have a \'verification passed\' status. The partner must be verified in order to proceed.',
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
  disabled: PropTypes.bool,
};

export default PublishDsrButton;
