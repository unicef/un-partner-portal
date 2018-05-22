import React from 'react';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Create from 'material-ui-icons/Create';
import IconWithTooltipButton from '../../../components/common/iconWithTooltipButton';
import withMultipleDialogHandling from '../../../components/common/hoc/withMultipleDialogHandling';
import NewUserModal from '../newUser/newUserModal';

const messages = {
  text: 'Edit user',
};

const edit = 'edit';

const EditUserButton = (props) => {
  const { id,
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;
  
  return (
    <div>
      <IconWithTooltipButton
        id={id}
        icon={<Create />}
        name="edit"
        text={messages.text}
        onClick={(e) => {
          e.stopPropagation();
          handleDialogOpen(edit);
        }}
      /> {dialogOpen[edit] && <NewUserModal
        id={id}
        open={dialogOpen[edit]}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

EditUserButton.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default compose(
  withMultipleDialogHandling,
  withRouter,
)(EditUserButton);
