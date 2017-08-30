import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';

const styleSheet = createStyleSheet('ContentDialog', theme => ({
  dialogTitle: {
    color: 'white',
    background: theme.palette.accent[500],
  },
  info: {
    fontSize: '14px',
    background: theme.palette.primary[100],
  },
}));

function infoSection(info, classes) {
  return info ? <div className={classes.info}><DialogContent>{info}</DialogContent></div> : null;
}

function ContentDialog(props) {
  const { classes, trigger, title, info, content, actions } = props;

  return (
    <Dialog open={trigger} >
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        {title}
      </DialogTitle>
      {infoSection(info, classes)}
      <DialogContent>
        {content}
      </DialogContent>
      <DialogContent>
        {actions}
      </DialogContent>
    </Dialog>
  );
}

ContentDialog.propTypes = {
  /**
   * Trigger, show dialog when true
   */
  trigger: PropTypes.bool.isRequired,
  /**
   * Component presenting dialog content
   */
  content: PropTypes.node.isRequired,
  /**
   * Component presenting dialog actions
   */
  actions: PropTypes.node.isRequired,
  /**
   * title of the dialog
   */
  title: PropTypes.string,
  /**
   * Extra info in grey section
   */
  info: PropTypes.string,

  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ContentDialog);
