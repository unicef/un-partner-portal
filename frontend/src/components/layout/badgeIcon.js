import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import LensIcon from 'material-ui-icons/Lens';
import NotificationsIcon from 'material-ui-icons/Notifications';
import Badge from 'material-ui/Badge';
import { loadNotificationsList } from '../../reducers/notificationsList';

const styleSheet = (theme) => {
  const white = 'rgba(255, 255, 255, 1)';
  return {
    badge: {
      backgroundColor: 'red',
      right: 0,
      top: 0,
      width: 20,
      height: 20,
      fontSize: 10,
      position: 'absolute',
      zIndex: 2,
    },
    iconBox: {
      width: 48,
      height: 48,
      color: white,
      fill: theme.palette.primary[400],
    },
    headerIcon: {
    },
    bell: {
      position: 'absolute',
      zIndex: 1,
    },
  };
};

class BadgeIcon extends Component {
  componentWillMount() {
    this.props.loadNotifications(false);
  }

  render() {
    const { classes, notifications, handleClick } = this.props;
    return (
      <IconButton color="contrast" onClick={(event) => { if (notifications > 0) handleClick(event); }}>
        <LensIcon className={`${classes.iconBox} ${classes.headerIcon}`} />
        <NotificationsIcon className={classes.bell} />
        {notifications > 0 && <Badge
          badgeContent={notifications}
          className={classes.iconBox}
          classes={{ badge: classes.badge }}
        />}
      </IconButton>
    );
  }
}

BadgeIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  loadNotifications: PropTypes.func.isRequired,
};

const mapState = state => ({
  notifications: state.notificationsList.totalCount,
});

const mapDispatch = dispatch => ({
  loadNotifications: loadMore => dispatch(loadNotificationsList(loadMore)),
});

const connectedBadgeIcon =
  connect(mapState, mapDispatch)(BadgeIcon);

export default withStyles(styleSheet, { name: 'BadgeIcon' })(connectedBadgeIcon);
