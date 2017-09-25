import React from 'react';
import PropTypes from 'prop-types';
import Preselect from 'material-ui-icons/ThumbUp';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';
import withApplicationStatusChange from '../../common/hoc/withApplicationStatusChange';
import { APPLICATION_STATUSES } from '../../../helpers/constants';

const messages = {
  text: 'Preselect',
};

const PreselectButton = (props) => {
  const { id, status, changeStatus, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Preselect />}
      name="preselect"
      text={messages.text}
      onClick={() => changeStatus(id)}
      {...other}
    />
  );
};

PreselectButton.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  changeStatus: PropTypes.func,
};

export default withApplicationStatusChange(APPLICATION_STATUSES.PRE)(PreselectButton);
