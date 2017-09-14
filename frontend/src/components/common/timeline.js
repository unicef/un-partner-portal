import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import DatePoint from './timeline/datePoint';
import { getToday, dayDifference } from '../../helpers/dates';

const styleSheet = createStyleSheet('Timeline', theme => ({
  root: {
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
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
}));

const calcFill = (start, end) => {
  const currentDate = getToday();
  const maxDateRange = Math.abs(dayDifference(start, end));
  const currentDayDifference = Math.abs(dayDifference(start, currentDate));
  return Math.floor((currentDayDifference / maxDateRange) * 100);
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
    const fill = calcFill(postedDate, startDate);
    return (
      <div className={classes.root}>
        <div className={classes.icons}>
          <DatePoint
            date={postedDate}
            label="Posted"
            align="left"
            color="green"
            flexSize={55}
          />
          <DatePoint
            bold
            date={deadlineDate}
            label="Application Deadline"
            align="center"
            color="red"
            flexSize={15}
          />
          <DatePoint
            date={notificationDate}
            label="Notification of results"
            align="center"
            color="blue"
            flexSize={15}
          />
          <DatePoint
            date={startDate}
            label="Estimated start date"
            align="right"
            color="dark"
            flexSize={15}
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

export default withStyles(styleSheet)(Timeline);
