import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import DatePoint from './timeline/datePoint';
import { getToday, dayDifference } from '../../helpers/dates';

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
      deadlineDate,
      notificationDate,
      startDate } = this.props;
    const fill = calcDistance(postedDate, startDate, getToday());
    return (
      <div className={classes.root}>
        <div className={classes.icons}>
          <DatePoint
            date={postedDate}
            label="Posted"
            align="left"
            color="green"
            position="top-start"
          />
          <DatePoint
            bold
            date={deadlineDate}
            label="Application Deadline"
            align="center"
            color="red"
            position="bottom-end"
            flexSize={calcDistance(postedDate, startDate, deadlineDate)}
          />
          <DatePoint
            date={notificationDate}
            label="Notification of results"
            align="center"
            color="blue"
            position="top-end"
            flexSize={calcDistance(deadlineDate, startDate, notificationDate)}
          />
          <DatePoint
            date={startDate}
            label="Estimated start date"
            align="right"
            color="dark"
            position="bottom-end"
            fullWidth
          />
        </div>
        <LinearProgress className={classes.bar} mode="determinate" value={fill} />
      </div>
    );
  }
}

Timeline.propTypes = {
  classes: PropTypes.object,
  postedDate: PropTypes.string,
  deadlineDate: PropTypes.string,
  notificationDate: PropTypes.string,
  startDate: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'Timeline' })(Timeline);
