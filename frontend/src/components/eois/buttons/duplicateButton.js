import React from 'react';
import PropTypes from 'prop-types';
import Copy from 'material-ui-icons/ContentCopy';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  text: 'Duplicate',
};

const duplicateItem = (id) => {
  console.log(`Duplicate: ${id}`);
};

const EditItemIcon = (props) => {
  const { id } = props;
  return (
    <IconWithTextButton
      icon={<Copy />}
      text={messages.text}
      onClick={() => duplicateItem(id)}
    />
  );
};

EditItemIcon.propTypes = {
  id: PropTypes.string,
};

export default EditItemIcon;
