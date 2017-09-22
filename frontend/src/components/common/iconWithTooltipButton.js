import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Tooltip from './tooltip';

const PreselectButton = (props) => {
  const { icon, onClick, text, name, ...other } = props;
  return (
    <div data-tip data-for={`${name}-button`} {...other}>
      <IconButton
        color="inherit"
        onClick={() => onClick()}
      >
        {icon}
      </IconButton>
      <Tooltip
        id={`${name}-button`}
        text={text}
      />
    </div>
  );
};


PreselectButton.propTypes = {
  icon: PropTypes.component,
  onClick: PropTypes.func,
  text: PropTypes.string,
  name: PropTypes.string,
};

export default PreselectButton;
