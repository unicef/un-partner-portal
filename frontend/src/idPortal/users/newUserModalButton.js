import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewUserModal from './newUserModal';
import withDialogHandling from '../../components/common/hoc/withDialogHandling'; 

const messages = {
  user: 'New user',
};

const NewUserModalButton = (props) => {
  const { handleDialogClose, handleDialogOpen, dialogOpen } = props;
  return (
    <React.Fragment>
      <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages.user}
      </Button>
      <NewUserModal open={dialogOpen} onDialogClose={handleDialogClose} />
    </React.Fragment>

  );
};

NewUserModalButton.propTypes = {
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default compose(
  withDialogHandling,
  withRouter)(NewUserModalButton);
