import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const messages = {
  focal: 'CFEI Focal Point(s)',
}

const styleSheet = theme => ({
  tooltip: {
    whiteSpace: 'pre-line',
  },
  cellText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mainText: {
    color: theme.palette.grey[300],
    fontSize: 12,
    paddingTop: '4px',
  },
  text: {
    color: theme.palette.grey[400],
    whiteSpace: 'pre-line',
    fontSize: 12,
    padding: 4,
  },
  divider: {
    background: theme.palette.grey[400],
  },
  focals: {
    padding: '4px',
  }
});

const renderExpandedCell = (focalPoints, classes) => {
  return <div>
    <Typography type="body2" color="inherit" className={classes.mainText}>
      {messages.focal}
    </Typography>
    <div className={classes.focals}>
      {focalPoints && focalPoints.map((focalPoint, index) => (
        <div key={focalPoint.id}>
          <Typography
            type="body1"
            className={classes.text}
            color="inherit"
          >
            {focalPoint.name}
          </Typography>
          {index !== (Object.keys(focalPoints).length - 1) && <Divider className={classes.divider} />}
        </div>
      ))}
    </div>
  </div>
}

const EoiAgencyFocalCell = (props) => {
  const { classes, agency, focalPoints, id } = props;
  return (
    <Tooltip
      className={classes.tooltip}
      id={`cfei_${id}`}
      title={renderExpandedCell(focalPoints, classes)}
    >
      <Typography className={classes.cellText}>
        {agency}
      </Typography>
    </Tooltip>
  );
};

EoiAgencyFocalCell.propTypes = {
  agency: PropTypes.string.isRequired,
  focalPoints: PropTypes.array,
  id: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'EoiAgencyFocalCell' })(EoiAgencyFocalCell);
