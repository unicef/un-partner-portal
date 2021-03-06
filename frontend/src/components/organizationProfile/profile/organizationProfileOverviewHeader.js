import R from 'ramda';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import OrganizationProfileHeaderOptions from './organizationProfileHeaderOptions';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  edit: 'Edit',
  lastUpdate: 'Last update: ',
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const padding = theme.spacing.unit * 4;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: `${paddingSmall}px`,
    },
    text: {
      color: theme.palette.primary[400],
      padding: `0 ${padding}px 0 ${padding}px`,
    },
    noPrint: {
      '@media print': {
        visibility: 'hidden',
        display: 'none',
      },
    },
  };
};

const OrganizationProfileOverviewHeader = (props) => {
  const { classes, update, hq, hasEditHqProfilePermission, displayType,
    hasEditProfilePermission, handleEditClick } = props;

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        {update && <Typography type="body1" color="inherit"> {messages.lastUpdate} {update}</Typography>}
      </div>
      {((!hq && hasEditHqProfilePermission) || (hq && hasEditProfilePermission) || (displayType !== 'Int' && hasEditProfilePermission)) ?
        (<Button className={classes.noPrint} onClick={handleEditClick} raised color="accent">
          {messages.edit}
        </Button>) : null}
      <OrganizationProfileHeaderOptions className={classes.noPrint} />
    </div>
  );
};

OrganizationProfileOverviewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  update: PropTypes.string.isRequired,
  hasEditProfilePermission: PropTypes.bool,
  hasEditHqProfilePermission: PropTypes.bool,
  hq: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.partnerId] || {},
  hasEditProfilePermission: checkPermission(PARTNER_PERMISSIONS.EDIT_PROFILE, state),
  hasEditHqProfilePermission: checkPermission(PARTNER_PERMISSIONS.EDIT_HQ_PROFILE, state),
  hq: R.path(['partnerProfileDetails', 'partnerProfileDetails', 'identification', 'registration', 'hq'], state),
  displayType: R.path(['partnerProfileDetails', 'partnerProfileDetails', 'identification', 'basic', 'display_type'], state),
});

const connected = connect(mapStateToProps)(OrganizationProfileOverviewHeader);

export default withStyles(styleSheet, { name: 'OrganizationProfileOverviewHeader' })(connected);
