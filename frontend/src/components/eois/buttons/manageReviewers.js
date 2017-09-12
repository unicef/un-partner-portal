import React from 'react';
import PropTypes from 'prop-types';
import People from 'material-ui-icons/People';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Manage Reviewers',
};

const editItem = (id) => {
  console.log(`Reviewers: ${id}`);
};

const EditItemIcon = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<People />}
      text={messages.text}
      onClick={() => editItem(id)}
    />
  );
};

EditItemIcon.propTypes = {
  id: PropTypes.string,
};

export default EditItemIcon;
