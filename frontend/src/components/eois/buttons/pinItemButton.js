import React from 'react';
import PropTypes from 'prop-types';
import PinIcon from '../../common/pinIcon';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Pin',
};

const pinItem = (id) => {
  console.log(`Pinned: ${id}`);
};

const PinItemIcon = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<PinIcon />}
      text={messages.text}
      onClick={() => pinItem(id)}
    />
  );
};

PinItemIcon.propTypes = {
  id: PropTypes.string,
};

export default PinItemIcon;
