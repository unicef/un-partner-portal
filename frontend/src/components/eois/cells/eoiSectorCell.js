import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Tooltip from '../../common/tooltip';
import { selectSector, selectSpecializations } from '../../../store';

const styleSheet = theme => ({
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
});

const renderShortCell = data => data.map(sector => sector.name).join(', ');
const renderExpandedCell = (sectors, classes) => sectors.map((sector, index) =>
  (
    <div>
      <Typography type="body2" color="inherit" className={classes.mainText} alignItems="left">
        {sector.name}
      </Typography>
      {sector.areas.map(area => (
        <Typography type="body1" color="inherit" className={classes.text} alignItems="left">
          {area}
        </Typography>
      ))}
      {index !== (Object.keys(sectors).length - 1) && <Divider className={classes.divider} />}
    </div>
  ),
);


const EoiSectorCell = (props) => {
  const { classes, id, sectors } = props;
  return (
    <div data-tip data-for={`${id}-sector-tooltip`}>
      {renderShortCell(sectors)}
      <Tooltip
        id={`${id}-sector-tooltip`}
        text={renderExpandedCell(sectors, classes)}
      />
    </div>
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
