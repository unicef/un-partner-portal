import React from 'react';
import PropTypes from 'prop-types';
import Save from 'material-ui-icons/Save';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Download as PDF',
};

const DownloadCfeiButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Save />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

DownloadCfeiButton.propTypes = {
  handleClick: PropTypes.func,
};

export default DownloadCfeiButton;
