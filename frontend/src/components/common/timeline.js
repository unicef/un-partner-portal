import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import DatePoint from './timeline/datePoint';
import { getToday, dayDifference } from '../../helpers/dates';
import DateLegend from './timeline/dateLegend';

const messages = {
  posted: 'Posted',
  clarification: 'Clarification Request Deadline',
  deadline: 'Application Deadline',
  notification: 'Notification of results',
  estimated: 'Estimated start date',
};

const styleSheet = theme => ({
  root: {
    padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 2}px`,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
  },
  bar: {
    width: `calc(100% - ${theme.spacing.unit * 4}px)`,
    position: 'absolute',
    top: 'calc(50% - 2.5px)',
  },
});

const calcDistance = (min, max, point) => {
  const maxDateRange = Math.abs(dayDifference(min, max));
  let currentDayDifference = dayDifference(min, point);
  if (currentDayDifference === 0) currentDayDifference = 0;
  
  return Math.abs(Math.floor((currentDayDifference / maxDateRange) * 100));
};

class Timeline extends Component {
  constructor() {
    super();
    this.state = { value: 100 };
  }

  render() {
    const {
      classes,
      postedDate,
      clarificationDate,
      deadlineDate,
      notificationDate,
      startDate } = this.props;
    const fill = calcDistance(postedDate, startDate, getToday());
    return (
      <div>
        <div className={classes.root}>
          <div className={classes.icons}>
            <DatePoint
              date={postedDate}
              open
              align="left"
              color="green"
              position="top-start"
            />
            <DatePoint
              date={clarificationDate}
              align="center"
              open
              color="orange"
              position="bottom-center"
              flexSize={calcDistance(postedDate, startDate, clarificationDate) || 0}
            />
            <DatePoint
              bold
              open
              date={deadlineDate}
              align="center"
              color="red"
              position="top-center"
              flexSize={calcDistance(clarificationDate, startDate, deadlineDate) || 0}
            />
            <DatePoint
              date={notificationDate}
              open
              align="center"
              color="blue"
              position="bottom-center"
              flexSize={calcDistance(deadlineDate, startDate, notificationDate) || 0}
            />
            <DatePoint
              date={startDate}
              align="right"
              color="dark"
              position="top-end"
              open
              fullWidth
            />
          </div>
          <LinearProgress className={classes.bar} mode="determinate" value={fill} />


        </div>
        <div className={classes.icons}>
          <DateLegend label={messages.posted} color="green" />
          <DateLegend label={messages.clarification} color="orange" />
          <DateLegend label={messages.deadline} color="red" />
          <DateLegend label={messages.notification} color="blue" />
          <DateLegend label={messages.estimated} color="dark" />
        </div>
      </div>
    );
  }
}

Timeline.propTypes = {
  classes: PropTypes.object,
  clarificationDate: PropTypes.string,
  postedDate: PropTypes.string,
  deadlineDate: PropTypes.string,
  notificationDate: PropTypes.string,
  startDate: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'Timeline' })(Timeline);
