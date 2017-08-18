import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import Tooltip from '../../common/tooltip';
import EoiStatusCell from './eoiStatusCell';


const styleSheet = createStyleSheet('EoiPartnerStatusCell', theme => ({
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
}));


const renderExpandedCell = (partners, classes) => (
  <div>
    <Typography type="body2" color="inherit" className={classes.mainText} align="left">
      Partner status:
    </Typography>
    { partners.map(partner => (
      <Typography type="body1" color="inherit" className={classes.text} align="left">
        {`${partner.name}:
${partner.status}`}
      </Typography>
    ))}
  </div>
);

const EoiPartnerStatusCell = (props) => {
  const { status, classes } = props;
  return (
    <div data-for="partnerStatusTooltip">
      <EoiStatusCell id={status.id} />
      { status.partner && <Tooltip
        id="partnerStatusTooltip"
        text={renderExpandedCell(status.partner, classes)}
      />}
    </div>
  );
};

EoiPartnerStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(EoiPartnerStatusCell);
