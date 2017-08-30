import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const styleSheet = createStyleSheet('OrganizationTypes', theme => ({
  dialogTitle: {
    color: 'white',
    background: theme.palette.accent[500],
  },
}));

function AlertDialog(props) {
  const { classes, trigger, title, text, handleDialogClose } = props;
  return (
    <Dialog open={trigger} >
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} raised color="accent">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  /**
   * Trigger, show dialog when true
   */
  trigger: PropTypes.bool.isRequired,
  /**
   * title of the dialog
   */
  title: PropTypes.string,
  /**
  * text body of the dialog
  */
  text: PropTypes.string,
  /**
  * lcallback called when dialog is closed
  */
  handleDialogClose: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(AlertDialog);
