import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogContent, DialogTitle, DialogActions } from 'material-ui/Dialog';
import ModalContentHeader from './modalContentHeader';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 4;

  return {
    dialogTitle: {
      color: 'white',
      background: theme.palette.secondary[500],
    },
    info: {
      fontSize: '14px',
      background: theme.palette.primary[100],
    },
    root: {
      padding: '0',
    },
    topBottom: {
      paddingTop: `${padding}px`,
      paddingBottom: `${padding}px`,
    },
  };
};

const messages = {
  cancel: 'Cancel',
  ok: 'Ok',
};


const ControlledModal = (props) => {
  const { classes, removeContentPadding, trigger, title,
    info, content, buttons, topBottomPadding } = props;
  return (
    <Dialog open={trigger} >
      <DialogTitle
        className={classes.dialogTitle}
        disableTypography
      >
        {title}
      </DialogTitle>

      {info && <ModalContentHeader
        titleText={info.title}
        bodyText={info.body}
      />}

      <DialogContent
        className={classNames({
          [classes.root]: removeContentPadding,
          [classes.topBottom]: topBottomPadding,
        })}
      >
        {content}
      </DialogContent>

      <DialogActions>
        {buttons.flat && <Button onTouchTap={buttons.flat.handleClick} color="accent">
          {buttons.flat.label || messages.cancel }
        </Button>
        }
        {buttons.raised && <Button onTouchTap={buttons.raised.handleClick} raised color="accent">
          {buttons.raised.label || messages.ok}
        </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

ControlledModal.propTypes = {
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
  buttons: PropTypes.object.isRequired,
  /**
   * title of the dialog
   */
  title: PropTypes.string,
  /**
   * Extra info in grey section
   */
  info: PropTypes.string,

  /**
   * Wrap content in DialogContent
   */
  removeContentPadding: PropTypes.bool,
  /**
   * Add top bottom padding for text content 
   */
  topBottomPadding: PropTypes.bool,


  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet, { name: 'ControlledModal' })(ControlledModal);
