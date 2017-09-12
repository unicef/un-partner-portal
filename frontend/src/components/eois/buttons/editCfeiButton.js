import React from 'react';
import PropTypes from 'prop-types';
import Create from 'material-ui-icons/Create';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Edit',
};

const editItem = (id) => {
  console.log(`Edit: ${id}`);
};

const EditItemIcon = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<Create />}
      text={messages.text}
      onClick={() => editItem(id)}
    />
  );
};

EditItemIcon.propTypes = {
  id: PropTypes.string,
};

export default EditItemIcon;
