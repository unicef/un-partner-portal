import React from 'react';
import PropTypes from 'prop-types';
import Preselect from 'material-ui-icons/ThumbUp';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Preselect',
};

const preselectApplication = (id) => {
  console.log(`Preselected: ${id}`);
};

const PreselectButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Preselect />}
      name="preselect"
      text={messages.text}
      onClick={() => preselectApplication(id)}
      {...other}
    />
  );
};

PreselectButton.propTypes = {
  id: PropTypes.string,
};

export default PreselectButton;
