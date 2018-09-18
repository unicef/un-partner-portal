import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Add Observation',
};

const AddNewObservationButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Add />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

AddNewObservationButton.propTypes = {
  handleClick: PropTypes.func,
};

export default AddNewObservationButton;
