import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import Typography from 'material-ui/Typography';
import Tooltip from '../../common/portalTooltip';
import EoiStatusCell from './eoiStatusCell';


const styleSheet = theme => ({
  mainText: {
    color: theme.palette.grey[400],
    fontWeight: 400,
    fontSize: 12,
    padding: '4px 8px',
  },
  text: {
    color: theme.palette.grey[300],
    fontWeight: 400,
    whiteSpace: 'pre-line',
    paddingLeft: 16,
    fontSize: 12,
  },
});

const renderExpandedCell = (partners, classes) => (
  <div>
    <Typography type="body2" className={classes.mainText} align="left">
      Partner status:
    </Typography>
    { partners.map(partnerStatus => (
      <Typography
        key={partnerStatus.legal_name}
        className={classes.text}
        align="left"
      >
        {`${partnerStatus.legal_name}
${partnerStatus.application_status}`}
      </Typography>
    ))}
  </div>
);

const EoiPartnerStatusCell = (props) => {
  const { status, classes, id, partners } = props;
  return (
    <Tooltip
      id={`${id}-partner-status-tooltip`}
      title={renderExpandedCell(partners, classes)}
      disabled={!partners}
    >
      <div>
        <EoiStatusCell status={status} />
      </div>
    </Tooltip>
  );
};

EoiPartnerStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  partners: PropTypes.array,
};

export default withStyles(styleSheet, { name: 'EoiPartnerStatusCell' })(EoiPartnerStatusCell);
