import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';


const styleSheet = createStyleSheet('OrganizationTypes', theme => ({
  dialogMain: {
    overflow: 'auto',
  },
  dialogTitle: {
    color: 'white',
    background: theme.palette.accent[500],
  },
}));

function AlertDialog(props) {
  const { classes, trigger, title, content } = props;
  return (
    <Dialog
      open={trigger}
      classes={{ paper: classes.dialogMain }}
      maxWidth="md"
    >
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        {title}
      </DialogTitle>
      {content}
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
  content: PropTypes.node,
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(AlertDialog);
