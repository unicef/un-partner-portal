import React from 'react';
import PropTypes from 'prop-types';
import RemovePreselection from 'material-ui-icons/Delete';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';
import withApplicationStatusChange from '../../common/hoc/withApplicationStatusChange';
import { APPLICATION_STATUSES } from '../../../helpers/constants';

const messages = {
  text: 'Remove from preselected list',
};


const RemovePreselectionButton = (props) => {
  const { id, changeStatus, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<RemovePreselection />}
      text={messages.text}
      onClick={(event) => {
        event.stopPropagation();
        changeStatus(id);
      }}
      {...other}
    />
  );
};

RemovePreselectionButton.propTypes = {
  id: PropTypes.string,
  changeStatus: PropTypes.func,
};

export default withApplicationStatusChange(APPLICATION_STATUSES.PEN)(RemovePreselectionButton);
