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
    >
      <IconButton
        color="inherit"
        onClick={() => onClick()}
        disabled={disabled}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};


PreselectButton.propTypes = {
  icon: PropTypes.component,
  onClick: PropTypes.func,
  text: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PreselectButton;
