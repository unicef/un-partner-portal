import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';

const messages = {
  open: 'New cfei',
  direct: 'new direct selection',
  unsolicited: 'New UCN'
};


const NewCfeiModalButton = (props) => {
  const { type, handleDialogClose, handleDialogOpen, dialogOpen } = props;
  return (
    <Grid item>
      <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages[type]}
      </Button>
      <NewCfeiModal type={type} open={dialogOpen} onDialogClose={handleDialogClose} />
    </Grid>

  );
};


NewCfeiModalButton.propTypes = {
  type: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(withRouter(NewCfeiModalButton));
