import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClearAll from 'material-ui-icons/ClearAll';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import SpreadContent from '../../components/common/spreadContent';
import Loader from '../../components/common/loader';
import NotificationItem from './notificationItem';
import { loadNotificationsList, readNotification, readAllNotifications } from '../../reducers/notificationsList';

const messages = {
  notifications: 'Notifications',
  markAll: 'Mark all as read',
  more: 'more',
};

const styleSheet = (theme) => {
  const paddingSide = theme.spacing.unit * 1.5;
  const padding = theme.spacing.unit;

  return {
    notification: {
      padding: `0px ${paddingSide}px ${paddingSide}px ${paddingSide}px`,
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


class NotificationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.handleReadNotification = this.handleReadNotification.bind(this);
    this.handleReadAll = this.handleReadAll.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentWillMount() {
    this.props.loadNotifications(false);
  }

  handleReadNotification(id) {
    const { markNotification } = this.props;

    markNotification(id);
  }

  handleReadAll() {
    const { markAllNotifications } = this.props;
    markAllNotifications();
  }

  handleMore() {
    const { loadNotifications } = this.props;

    loadNotifications(true);
  }

  render() {
    const { classes, loading, items, itemsPatch, next } = this.props;

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
            (<NotificationItem
              key={item.id}
              item={item}
              itemPatch={itemsPatch[item.notification.id]}
              handleReadNotification={this.handleReadNotification}
            />),
          )}
        </div>
        {next && !loading && <SpreadContent>
          <div />
          <Button color="accent" onClick={() => this.handleMore()}>
            {messages.more}
          </Button>
        </SpreadContent>}
      </Paper>
    );
  }
}

NotificationsList.propTypes = {
  classes: PropTypes.object,
  items: PropTypes.array,
  next: PropTypes.string,
  itemsPatch: PropTypes.object,
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

const connectedNotificationsList =
  connect(mapState, mapDispatch)(NotificationsList);

export default withStyles(styleSheet, { name: 'NotificationsList' })(connectedNotificationsList);

