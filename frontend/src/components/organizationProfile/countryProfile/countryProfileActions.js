import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { DialogActions } from 'material-ui/Dialog';

const messages = {
  create: 'Create',
  cancel: 'Cancel',
};

const CountryProfileActions = (props) => {
  const { close, create } = props;
  return (
    <DialogActions>
      <Button onClick={close} color="accent">
        {messages.cancel}
      </Button>
      <Button onClick={create} raised color="accent">
        {messages.create}
      </Button>
    </DialogActions>
  );
};

CountryProfileActions.propTypes = {
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

export default CountryProfileActions;
