import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 4;

  return {
    dialogTitle: {
      color: 'white',
      background: theme.palette.secondary[500],
    },
    top: {
      paddingTop: `${padding}px`,
    },
  };
};

function AlertDialog(props) {
  const { classes, trigger, title, text, handleDialogClose, showCancel, handleClick } = props;
  return (
    <Dialog open={trigger} >
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.top}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {showCancel && <Button onClick={handleDialogClose} color="accent">
          Cancel
        </Button>}
        <Button onClick={handleClick || handleDialogClose} raised color="accent">
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
  * cancel button of dialog
  */
  showCancel: PropTypes.bool,
  /**
  * handle click of ok button of dialog
  */
  handleClick: PropTypes.func,
  /**
  * lcallback called when dialog is closed
  */
  handleDialogClose: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'AlertDialog' })(AlertDialog);
