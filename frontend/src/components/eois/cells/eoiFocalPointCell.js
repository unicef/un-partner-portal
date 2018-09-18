import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from '../../common/portalTooltip';

const styleSheet = theme => ({
  mainText: {
    color: theme.palette.grey[300],
    fontSize: 12,
    padding: '4px 8px',
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
});

const renderExpandedCell = (focalPoints, classes) =>
  focalPoints && focalPoints.map((focalPoint, index) => (
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
  ));


const EoiFocalPointCell = (props) => {
  const { id, classes, data } = props;
  return (
    <Tooltip
      id={`${id}-sector-tooltip`}
      title={renderExpandedCell(data, classes)}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {data && data.length}
      </div>
    </Tooltip>
  );
};

EoiFocalPointCell.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.number,
  data: PropTypes.array.isRequired,
};

export default withStyles(styleSheet, { name: 'EoiSectorCell' })(EoiFocalPointCell);
