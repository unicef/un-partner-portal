import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClearAll from 'material-ui-icons/ClearAll';
import Close from 'material-ui-icons/Close';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import SpreadContent from '../../components/common/spreadContent';
import Loader from '../../components/common/loader';
import { formatDateForPrint } from '../../helpers/dates';
import { loadNotificationsList, readNotification, readAllNotifications } from '../../reducers/notificationsList';

const messages = {
  notifications: 'Notifications',
  markAll: 'Mark all as read',
};

const styleSheet = (theme) => {
  const paddingSide = theme.spacing.unit * 1.5;
  const padding = theme.spacing.unit;

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
      padding: `${paddingSide}px ${paddingSide}px ${paddingSide}px ${paddingSide}px`,
    },
    root: {
      width: '25vw',
      maxHeight: '55vh',
      overflow: 'auto',
    },
    paper: {
      backgroundColor: theme.palette.common.gray,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: `0px ${paddingSide}px ${padding}px ${paddingSide}px`,
    },
    wrapper: {
      alignSelf: 'end',
      display: 'flex',
    },
    icon: {
      marginLeft: 'auto',
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


class PartnerProfileIdentification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.handleReadNotification = this.handleReadNotification.bind(this);
    this.handleReadAll = this.handleReadAll.bind(this);
    this.notificationItem = this.notificationItem.bind(this);
  }

  componentWillMount() {
    this.props.loadNotifications();
  }

  handleReadNotification(id) {
    const { markNotification } = this.props;

    markNotification(id);
  }

  handleReadAll() {
    const { markAllNotifications } = this.props;
    markAllNotifications();
  }

  notificationItem(item, itemPatch) {
    const { classes } = this.props;

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
              <Typography
                className={classes.description}
                type="body1"
              >
                {item.notification.description}
              </Typography>
            </div>
            <div className={classes.wrapper}>
              {!item.did_read && !isLoading && <IconButton
                className={classes.iconClose}
                type="button"
                title="Mark as read"
                onClick={() => this.handleReadNotification(item.notification.id)}
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
        </Paper>

      </div>);
  }

  render() {
    const { classes, loading, items, itemsPatch } = this.props;
    return (
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <div>
            <Typography
              className={classes.description}
              type="body1"
            >
              {messages.notifications}
            </Typography>
          </div>
          <IconButton
            className={classes.icon}
            type="button"
            title="Read all notifications"
            onClick={() => this.handleReadAll()}
          ><ClearAll />
          </IconButton>
        </div>

        <Loader loading={loading} />
        <div className={classes.root}>
          {items.map(item =>
            this.notificationItem(item, itemsPatch[item.notification.id]))}
        </div>
      </Paper>
    );
  }
}

PartnerProfileIdentification.propTypes = {
  classes: PropTypes.object,
  items: PropTypes.array,
  itemsPatch: PropTypes.array,
  loadNotifications: PropTypes.func,
  markNotification: PropTypes.func,
  markAllNotifications: PropTypes.func,
  loading: PropTypes.bool,
};

const mapState = state => ({
  items: state.notificationsList.items,
  itemsPatch: state.notificationsList.itemsPatch,
  next: state.notificationsList.next,
  loading: state.notificationsList.loading,
});

const mapDispatch = dispatch => ({
  dispatch,
  loadNotifications: loadMore => dispatch(loadNotificationsList(loadMore)),
  markAllNotifications: loadMore => dispatch(readAllNotifications(loadMore)),
  markNotification: id => dispatch(readNotification(id)),
});

const connectedPartnerProfileIdentification =
  connect(mapState, mapDispatch)(PartnerProfileIdentification);


export default withStyles(styleSheet, { name: 'NotificationsList' })(connectedPartnerProfileIdentification);

