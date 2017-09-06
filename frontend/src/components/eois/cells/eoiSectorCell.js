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

const renderShortCell = data => data.map(sector => sector.name).join(', ');
const renderExpandedCell = (data, classes) => data.map((sector, index) =>
  (
    <div>
      <Typography type="body2" color="inherit" className={classes.mainText} align="left">
        {sector.name}
      </Typography>
      { sector.specializations.map(area => (
        <Typography type="body1" color="inherit" className={classes.text} align="left">
          {area.name}
        </Typography>
      ))}
      {index !== (Object.keys(data).length - 1) && <Divider className={classes.divider} />}
    </div>
  ),
);


const EoiSectorCell = (props) => {
  const { data, classes, id } = props;
  return (
    <div >
      {typeof data === 'string' ? data : (
        <div data-tip data-for={`${id}-sector-tooltip`}>
          {renderShortCell(data)}
          <Tooltip
            id={`${id}-sector-tooltip`}
            text={renderExpandedCell(data, classes)}
          />
        </div>
      )}
    </div>
  );
};

EoiSectorCell.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
};

export default withStyles(styleSheet)(EoiSectorCell);
