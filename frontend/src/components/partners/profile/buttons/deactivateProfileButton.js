import React from 'react';
import PropTypes from 'prop-types';
import Cancel from 'material-ui-icons/Cancel';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Deactivate Profile',
};

const deactivateProfile = (id) => {
  console.log(`Deactivate profile: ${id}`);
};

const DeactivateProfileButton = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<Cancel />}
      text={messages.text}
      onClick={() => deactivateProfile(id)}
    />
  );
};

DeactivateProfileButton.propTypes = {
  id: PropTypes.string,
};

export default DeactivateProfileButton;
