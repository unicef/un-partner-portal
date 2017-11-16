import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styleSheet = () => ({
  tooltip: {
    whiteSpace: 'pre-line',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
});


const eoiDSPartnersCell = (props) => {
  const { classes, partners, id } = props;
  return (
    <Tooltip
      className={classes.tooltip}
      id={`partners_${id}`}
      title={partners.join('\n')}
    >
      <Typography className={classes.text}>
        { partners.join(', ')}
      </Typography>
    </Tooltip>
  );
};

eoiDSPartnersCell.propTypes = {
  partners: PropTypes.string.isRequired,
  id: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfConceptNotes;' })(eoiDSPartnersCell);
