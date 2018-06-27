import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import ControlledModal from '../../common/modals/controlledModal';
import OrganizationProfileContent from '../../eois/details/submission/modal/organizationProfileContent';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  viewProfile: 'View your profile.',
  close: 'close',
  editProfile: 'edit profile',
  countryProfile: 'Country Profile',
};

const styleSheet = theme => ({
  labelUnderline: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.palette.primary[500],
  },
});

let ProfileViewLink = (props) => {
  const { classes, handleDialogClose, handleDialogOpen, dialogOpen, partnerId, hasPermission } = props;
  return (
    <div>
      <Typography
        onClick={handleDialogOpen}
        className={classes.labelUnderline}
        type="body1"
      >
        {messages.viewProfile}
      </Typography>
      <ControlledModal
        maxWidth="md"
        title={messages.countryProfile}
        trigger={dialogOpen}
        handleDialogClose={handleDialogClose}
        buttons={{
          flat: {
            handleClick: handleDialogClose,
            label: messages.close,
          },
          raised: hasPermission
            ? {
              handleClick: () => history.push(`/profile/${partnerId}/edit`),
              label: messages.editProfile,
            }
            : null,
        }}
        removeContentPadding
        content={<OrganizationProfileContent partnerId={partnerId} />}
      />
    </div >
  );
};

const mapStateToProps = state => ({
  partnerId: state.session.partnerId,
  hasPermission: checkPermission(PARTNER_PERMISSIONS.EDIT_HQ_PROFILE, state)
  || checkPermission(PARTNER_PERMISSIONS.EDIT_PROFILE, state),
});

ProfileViewLink = connect(
  mapStateToProps,
)(ProfileViewLink);

export default withStyles(styleSheet,
  { name: 'ProfileViewLink' })(withDialogHandling(ProfileViewLink));
