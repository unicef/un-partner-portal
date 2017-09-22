import React from 'react';
import PropTypes from 'prop-types';
import Reject from 'material-ui-icons/ThumbDown';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Reject',
};

const rejectApplication = (id) => {
  console.log(`Rejected: ${id}`);
};

const RejectButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Reject />}
      name="reject"
      text={messages.text}
      onClick={() => rejectApplication(id)}
      {...other}
    />
  );
};

RejectButton.propTypes = {
  id: PropTypes.string,
};

export default RejectButton;
