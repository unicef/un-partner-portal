import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

const PreselectButton = (props) => {
  const { icon, onClick, disabled, text, name, ...other } = props;
  return (
    <Tooltip
      id={`${name}-button`}
      title={text}
      placement="bottom"
      disableTriggerFocus={disabled}
      disableTriggerHover={disabled}
      disableTriggerTouch={disabled}
    >
      <div>
        <IconButton
          color="inherit"
          onClick={e => onClick(e)}
          disabled={disabled}
        >
          {icon}
        </IconButton>
      </div>
    </Tooltip>
  );
};


PreselectButton.propTypes = {
  icon: PropTypes.object,
  onClick: PropTypes.func,
  text: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PreselectButton;
