import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from '../../common/portalTooltip';
import { selectSector, selectSpecializations } from '../../../store';

const styleSheet = theme => ({
  mainText: {
    color: theme.palette.grey[300],
    fontSize: 12,
    padding: '4px 8px',
  },
  text: {
    color: theme.palette.grey[400],
    whiteSpace: 'pre-line',
    paddingLeft: 16,
    paddingBottom: 8,
    fontSize: 12,
  },
  divider: {
    background: theme.palette.grey[400],
  },
});

const renderShortCell = data => data.map(sector => sector.name).join(', ');
const renderExpandedCell = (sectors, classes) => sectors.map((sector, index) => (
  <div key={sector.name}>
    <Typography type="body2" color="inherit" className={classes.mainText}>
      {sector.name}
    </Typography>
    {sector.areas.map(area => (
      <Typography
        key={area}
        type="body1"
        color="inherit"
        className={classes.text}
      >
        {area}
      </Typography>
    ))}
    {index !== (Object.keys(sectors).length - 1) && <Divider className={classes.divider} />}
  </div>
));


const EoiSectorCell = (props) => {
  const { classes, id, sectors } = props;
  return (
    <Tooltip
      id={`${id}-sector-tooltip`}
      title={renderExpandedCell(sectors, classes)}
    >
      <div>
        {renderShortCell(sectors)}
      </div>
    </Tooltip>
  );
};

EoiSectorCell.propTypes = {
  classes: PropTypes.object.isRequired,
  sectors: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
};

const connectedEoiSectorCell = connect(
  (state, ownProps) => ({ sectors:
        ownProps.data.map(s => ({
          name: selectSector(state, s.sector),
          areas: R.values(selectSpecializations(state, s.areas)),
        })),
  }),
)(EoiSectorCell);

export default withStyles(styleSheet, { name: 'EoiSectorCell' })(connectedEoiSectorCell);
