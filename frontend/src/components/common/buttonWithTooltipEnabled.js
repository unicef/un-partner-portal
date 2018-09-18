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
    >
      <div>
        <Button
          color="accent"
          raised
          onTouchTap={e => onClick(e)}
          disabled={disabled}
          {...other}
        >
          {text}
        </Button>
      </div>
    </Tooltip>
  );
};

ButtonWithTooltip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onClick: PropTypes.func,
  tooltipText: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonWithTooltip;
