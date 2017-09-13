import React from 'react';
import PropTypes from 'prop-types';
import PersonAdd from 'material-ui-icons/PersonAdd';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Invite partner',
};

const editItem = (id) => {
  console.log(`Partner Invite: ${id}`);
};

const EditItemIcon = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<PersonAdd />}
      text={messages.text}
      onClick={() => editItem(id)}
    />
  );
};

EditItemIcon.propTypes = {
  id: PropTypes.string,
};

export default EditItemIcon;
