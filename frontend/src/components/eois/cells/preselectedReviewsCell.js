import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
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
    paddingLeft: 16,
    paddingBottom: 8,
    fontSize: 12,
  },
  divider: {
    background: theme.palette.grey[400],
  },
});

const messages = {
  info: 'Number of Reviews Completed / Number of Reviewers',
};

const renderExpandedCell = classes => (
  <Typography
    type="body1"
    color="inherit"
    className={classes.text}
  >
    {messages.info}
  </Typography>
);


const EoiSectorCell = (props) => {
  const { classes, id, reviews } = props;
  return (
    <Tooltip
      id={`${id}-sector-tooltip`}
      title={renderExpandedCell(classes)}
    >
      <div>
        {reviews}
      </div>
    </Tooltip>
  );
};

EoiSectorCell.propTypes = {
  classes: PropTypes.object.isRequired,
  reviews: PropTypes.String,
  id: PropTypes.number.isRequired,
};

export default withStyles(styleSheet, { name: 'EoiSectorCell' })(EoiSectorCell);
