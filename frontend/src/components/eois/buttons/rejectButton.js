import React from 'react';
import PropTypes from 'prop-types';
import Reject from 'material-ui-icons/ThumbDown';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';
import withApplicationStatusChange from '../../common/hoc/withApplicationStatusChange';
import { APPLICATION_STATUSES } from '../../../helpers/constants';

const messages = {
  text: 'Reject',
};

const RejectButton = (props) => {
  const { id, status, changeStatus, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Reject />}
      name="reject"
      text={messages.text}
      onClick={() => changeStatus(id)}
      {...other}
    />
  );
};

RejectButton.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  changeStatus: PropTypes.func,
};

export default withApplicationStatusChange(APPLICATION_STATUSES.REJ)(RejectButton);
