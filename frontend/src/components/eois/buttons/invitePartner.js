import React from 'react';
import PropTypes from 'prop-types';
import PersonAdd from 'material-ui-icons/PersonAdd';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Invite partner',
};

const EditItemIcon = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<PersonAdd />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

EditItemIcon.propTypes = {
  handleClick: PropTypes.func,
};

export default EditItemIcon;
