import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

const ButtonWithTooltip = (props) => {
  const { text, onClick, disabled, tooltipText, name, ...other } = props;
  return (
    <Tooltip
      id={`${name}-button`}
      title={tooltipText}
      placement="bottom"
      disableTriggerFocus={disabled}
      disableTriggerHover={disabled}
      disableTriggerTouch={disabled}
    >
      <div>
        <Button
          color="accent"
          raised
          onClick={e => onClick(e)}
          disabled={disabled}
        >
          {text}
        </Button>
      </div>
    </Tooltip>
  );
};

ButtonWithTooltip.propTypes = {
  text: PropTypes.object,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonWithTooltip;
