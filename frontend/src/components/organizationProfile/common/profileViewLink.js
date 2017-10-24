import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { formatDateForPrint } from '../../../helpers/dates';
import ControlledModal from '../../common/modals/controlledModal';
import OrganizationProfileContent from '../../eois/details/submission/modal/organizationProfileContent';
import withDialogHandling from '../../common/hoc/withDialogHandling';

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
  const { classes, handleDialogClose, handleDialogOpen, dialogOpen, partnerId } = props;
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
        buttons={{
          flat: {
            handleClick: handleDialogClose,
            label: messages.close,
          },
          raised: {
            handleClick: () => history.push(`/profile/${partnerId}/edit`),
            label: messages.editProfile,
          },
        }}
        removeContentPadding
        content={<OrganizationProfileContent />}
      />
    </div >
  );
};

const mapStateToProps = state => ({
  partnerId: state.session.partnerId,
});

ProfileViewLink = connect(
  mapStateToProps,
)(ProfileViewLink);

export default withStyles(styleSheet,
  { name: 'ProfileViewLink' })(withDialogHandling(ProfileViewLink));
