import React from 'react';
import PropTypes from 'prop-types';
import Close from 'material-ui-icons/Close';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import SpreadContent from '../../components/common/spreadContent';
import { formatDateForPrint } from '../../helpers/dates';

const styleSheet = (theme) => {
  const paddingSide = theme.spacing.unit * 1.5;

  return {
    spinner: {
      position: 'fixed',
      left: 'calc(50% - 25px)',
      top: 'calc(50% - 25px)',
    },
    notification: {
      padding: `0px ${paddingSide}px ${paddingSide}px ${paddingSide}px`,
    },
    notificationItem: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    },
    wrapper: {
      alignSelf: 'end',
      display: 'flex',
    },
    iconClose: {
      marginBottom: 'auto',
      marginLeft: `${paddingSide}px`,
    },
    description: {
      color: theme.palette.common.grayText,
    },
  };
};

const NotificationItem = (props) => {
  const { classes, item, itemPatch, handleReadNotification } = props;

  const isLoading = itemPatch ? itemPatch.loading : false;

  return (
    <div className={classes.notification}>
      <Paper className={classes.notificationItem}>
        <SpreadContent>
          <div>
            <Typography
              type="caption"
            >
              {formatDateForPrint(item.notification.created)}
            </Typography>
            <Typography
              type="subheading"
            >
              {item.notification.name}
            </Typography>
          </div>
          <div className={classes.wrapper}>
            {!item.did_read && !isLoading && <IconButton
              className={classes.iconClose}
              type="button"
              title="Mark as read"
              onClick={() => handleReadNotification(item.notification.id)}
            ><Close />
            </IconButton>}
            {isLoading &&
              <IconButton
                disabled
                className={classes.iconClose}
              >
                <CircularProgress
                  color="accent"
                  size={20}
                />
              </IconButton>}
          </div>
        </SpreadContent>
        <Typography
          dangerouslySetInnerHTML={{ __html: item.notification.html_description }}
          className={classes.description}
          type="body1"
        />
      </Paper>
    </div>);
};

NotificationItem.propTypes = {
  classes: PropTypes.object,
  item: PropTypes.object,
  itemPatch: PropTypes.object,
  handleReadNotification: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'NotificationItem' })(NotificationItem);
