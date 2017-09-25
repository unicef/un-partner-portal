import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Tooltip from './tooltip';

const PreselectButton = (props) => {
  const { icon, onClick, disabled, text, name, ...other } = props;
  return (
    <div data-tip data-for={`${name}-button`} {...other}>
      <IconButton
        color="inherit"
        onClick={() => onClick()}
        disabled={disabled}
      >
        {icon}
      </IconButton>
      {!disabled && <Tooltip
        id={`${name}-button`}
        text={text}
      />}
    </div>
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
