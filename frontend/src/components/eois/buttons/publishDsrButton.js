import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Publish',
  tooltipInfo: 'This DS/R cannot be published as partner selected does not have a \'verification passed\' status. The partner must be verified in order to proceed.',
  tooltipInfoProfile: 'This DS/R cannot be published as partner selected does not have a \'complete profile\'. The partner must complete profile information in order to proceed.',
};

const PublishDsrButton = (props) => {
  const { handleClick, isComplete, isVerified } = props;
  return (!isComplete || !isVerified) ?
    <ButtonWithTooltipEnabled
      name="publish"
      text={messages.text}
      tooltipText={!isVerified ? messages.tooltipInfo : messages.tooltipInfoProfile}
      onClick={handleClick}
      disabled={!isComplete || !isVerified}
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
  isComplete: PropTypes.bool,
  isVerified: PropTypes.bool,
};

export default PublishDsrButton;
