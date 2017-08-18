import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from '../../common/tooltip';


const styleSheet = createStyleSheet('EoiSectorCell', theme => ({
  mainText: {
    color: theme.palette.grey[300],
    fontWeight: 400,
    fontSize: 12,
    padding: '4px 8px',
  },
  text: {
    color: theme.palette.grey[400],
    fontWeight: 300,
    whiteSpace: 'pre-line',
    paddingLeft: 16,
    fontSize: 12,
  },
  divider: {
    background: theme.palette.grey[400],
    margin: '8px 0px',
  },
}));

const renderShortCell = data => Object.keys(data).join(', ');
const renderExpandedCell = (data, classes) => Object.keys(data).map((sector, index) =>
  (
    <div>
      <Typography type="body2" color="inherit" className={classes.mainText} align="left">
        {sector}
      </Typography>
      { data[sector].map(area => (
        <Typography type="body1" color="inherit" className={classes.text} align="left">
          {area}
        </Typography>
      ))}
      {index !== (Object.keys(data).length - 1) && <Divider className={classes.divider} />}
    </div>
  ),
);


const EoiSectorCell = (props) => {
  const { data, classes } = props;
  return (
    <div >
      {typeof data === 'string' ? data : (
        <div data-tip data-for="sectorTooltip">
          {renderShortCell(data)}
          <Tooltip
            id="sectorTooltip"
            text={renderExpandedCell(data, classes)}
          />
        </div>
      )}
    </div>
  );
};

EoiSectorCell.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(EoiSectorCell);
