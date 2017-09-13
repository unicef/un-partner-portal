import React, { Component } from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import SvgIcon from 'material-ui/SvgIcon';
import DatePoint from './timeline/datePoint';

const styleSheet = createStyleSheet('Timeline', (theme) => {
  const circleSize = 12;
  return {
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
  };
});

class Timeline extends Component {
  constructor() {
    super();
    this.state = { value: 100 };
  }

  render() {
    const { classes, postedDate, deadlineDate, notificationDate, startDate } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.icons}>
          <DatePoint
            big
            date="01 sep 2017"
            label="Posted"
            align="left"
            color="green"
          />
          <DatePoint
            small
            bold
            date="01 sep 2017"
            label="Application Deadline"
            align="center"
            color="red"
          />
          <DatePoint
            small
            date="01 sep 2017"
            label="Notification of results"
            align="center"
            color="blue"
          />
          <DatePoint
            small
            date="06 sep 2017"
            label="Estimated start date"
            align="right"
            color="dark"
          />
        </div>
        <LinearProgress className={classes.bar} mode="determinate" value={43} />

      </div>
    );
  }
}

export default withStyles(styleSheet)(Timeline);
