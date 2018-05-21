import React from 'react';
import PropTypes from 'prop-types';
import Create from 'material-ui-icons/Create';
import IconWithTooltipButton from '../../../components/common/iconWithTooltipButton';

const messages = {
  text: 'Edit user',
};

const EditUserButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Create />}
      name="edit"
      text={messages.text}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...other}
    />
  );
};

EditUserButton.propTypes = {
  id: PropTypes.number,
};

export default EditUserButton;
