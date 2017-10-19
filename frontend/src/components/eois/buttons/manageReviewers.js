import React from 'react';
import PropTypes from 'prop-types';
import People from 'material-ui-icons/People';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Manage Reviewers',
};


const EditItemIcon = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<People />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

EditItemIcon.propTypes = {
  handleClick: PropTypes.func,
};

export default EditItemIcon;
