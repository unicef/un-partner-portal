import React from 'react';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Create from 'material-ui-icons/Create';
import IconWithTooltipButton from '../../../components/common/iconWithTooltipButton';
import withMultipleDialogHandling from '../../../components/common/hoc/withMultipleDialogHandling';
import NewUserModal from '../newUser/newUserModal';

const styleSheet = theme => ({
  grey: {
    color: theme.palette.primary[700],
    '&:hover': {
      color: theme.palette.primary[900],
    },
  },
});

const messages = {
  text: 'Edit user',
};

const edit = 'edit';

const EditUserButton = (props) => {
  const { id,
    classes,
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;

  return (
    <div>
      <IconWithTooltipButton
        id={id}
        icon={<Create className={classes.grey} />}
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
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default compose(
  withMultipleDialogHandling,
  withRouter,
  withStyles(styleSheet, { name: 'editUserButton' }),
)(EditUserButton);
