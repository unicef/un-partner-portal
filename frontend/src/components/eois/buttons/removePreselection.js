import React from 'react';
import PropTypes from 'prop-types';
import RemovePreselection from 'material-ui-icons/Delete';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Remove from preselected list',
};

const removePreselection = (id) => {
  console.log(`Removed Preselected: ${id}`);
};

const RemovePreselectionButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<RemovePreselection />}
      name="removePreselect"
      text={messages.text}
      onClick={() => removePreselection(id)}
      {...other}
    />
  );
};

RemovePreselectionButton.propTypes = {
  id: PropTypes.string,
};

export default RemovePreselectionButton;
