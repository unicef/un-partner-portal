import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Tooltip from '../../common/portalTooltip';

const styleSheet = theme => ({
  mainText: {
    color: theme.palette.grey[300],
    fontSize: 12,
    padding: '4px 8px',
  },
});

const messages = {
  info: 'Number of Reviews Completed / Number of Reviewers',
};

const renderExpandedCell = classes => (
  <Typography
    type="body1"
    color="inherit"
    className={classes.mainText}
  >
    {messages.info}
  </Typography>
);


const EoiSectorCell = (props) => {
  const { classes, id, reviews } = props;
  return (
    <TableCell>
      <Tooltip
        id={`${id}-review-progress-tooltip`}
        title={renderExpandedCell(classes)}
      >
        <div>
          {reviews}
        </div>
      </Tooltip>
    </TableCell>
  );
};

EoiSectorCell.propTypes = {
  classes: PropTypes.object.isRequired,
  reviews: PropTypes.String,
  id: PropTypes.number.isRequired,
};

export default withStyles(styleSheet, { name: 'EoiSectorCell' })(EoiSectorCell);
