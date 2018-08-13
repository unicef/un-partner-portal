
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import AlertDialog from '../../common/alertDialog';
import DropdownMenu from '../../common/dropdownMenu';
import SpreadContent from '../../common/spreadContent';
import AddNewVerificationButton from './buttons/addNewVerificationButton';
import AddNewObservationButton from './buttons/addNewObservationButton';
import AddVerificationModal from './modals/addVerificationModal/addVerificationModal';
import AddFlagModal from './modals/addFlagModal/addFlagModal';
import withMultipleDialogHandling from '../../common/hoc/withMultipleDialogHandling';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const addVerification = 'addVerification';
const addObservation = 'addObservation';

const messages = {
  warning: 'Warning',
  verifyPartner: 'Partner profile is not verified. Please verify partner before adding an observation.',
  addVerification: 'Partner profile can not be verified until HQ profile will be verified.',
  hasFinished: 'Partner profile has not filled all required informations.',
  hasSanctionMatch: 'Partner has sanction match observation and can not be verified.',
};

class PartnerProfileHeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      verifyPartner: false,
      addVerification: false,
      hasFinished: false,
      hasSanctionMatch: false,
    };
    this.profileOptions = this.profileOptions.bind(this);
  }

  profileOptions() {
    const {
      hasVerifyHqPermission,
      hasVerifyAllCSOPermission,
      hasVerifyAssignedCSOPermission,
      hasAddFlagAllPermission,
      hasAddFlagCSOPermission,
      partnerProfile,
      agencyCountryCode,
      handleDialogOpen } = this.props;

    const options = [];

    if (hasVerifyHqPermission || hasVerifyAllCSOPermission
      || (hasVerifyAssignedCSOPermission && agencyCountryCode === partnerProfile.countryCode)) {
      options.push(
        {
          name: addVerification,
          content: <AddNewVerificationButton handleClick={() => {
            if (!partnerProfile.partnerStatus.has_potential_sanction_match) {
              if (partnerProfile.partnerStatus.can_be_verified && partnerProfile.partnerStatus.has_finished) {
                handleDialogOpen(addVerification);
              } else if (!partnerProfile.isHq && partnerProfile.partnerStatus.has_finished) {
                this.setState({ addVerification: true });
              } else if (!partnerProfile.partnerStatus.has_finished) {
                this.setState({ hasFinished: true });
              }
            } else {
              this.setState({ hasSanctionMatch: true });
            }
          }}
          />,
        });
    }

    if (hasAddFlagAllPermission
      || (hasAddFlagCSOPermission && !partnerProfile.isHq
          && agencyCountryCode === partnerProfile.countryCode)) {
      options.push(
        {
          name: addObservation,
          content: <AddNewObservationButton
            handleClick={() => {
              handleDialogOpen(addObservation);
            }}
          />,
        });
    }

    return options;
  }

  render() {
    const { params: { id },
      dialogOpen,
      handleDialogClose } = this.props;

    return (
      <SpreadContent>
        {this.profileOptions().length > 0 && <DropdownMenu
          options={this.profileOptions()}
        />}

        {dialogOpen[addVerification] && <AddVerificationModal
          partnerId={id}
          dialogOpen={dialogOpen[addVerification]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[addObservation] && <AddFlagModal
          partnerId={id}
          dialogOpen={dialogOpen[addObservation]}
          handleDialogClose={handleDialogClose}
        />}
        <AlertDialog
          trigger={!!this.state.addVerification}
          title={messages.warning}
          text={messages.verifyPartner}
          handleDialogClose={() => this.setState({ addVerification: false })}
        />
        <AlertDialog
          trigger={!!this.state.verifyPartner}
          title={messages.warning}
          text={messages.verifyPartner}
          handleDialogClose={() => this.setState({ verifyPartner: false })}
        />
        <AlertDialog
          trigger={!!this.state.hasFinished}
          title={messages.warning}
          text={messages.hasFinished}
          handleDialogClose={() => this.setState({ hasFinished: false })}
        />
        <AlertDialog
          trigger={!!this.state.hasSanctionMatch}
          title={messages.warning}
          text={messages.hasSanctionMatch}
          handleDialogClose={() => this.setState({ hasSanctionMatch: false })}
        />
      </SpreadContent>
    );
  }
}

PartnerProfileHeaderMenu.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  partnerProfile: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  hasAddFlagAllPermission: PropTypes.bool,
  hasAddFlagCSOPermission: PropTypes.bool,
  hasVerifyHqPermission: PropTypes.bool,
  hasVerifyAllCSOPermission: PropTypes.bool,
  hasVerifyAssignedCSOPermission: PropTypes.bool,
  agencyCountryCode: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  partnerProfile: state.agencyPartnerProfile.data[ownProps.params.id] || {},
  agencyCountryCode: state.session.officeCountryCode,
  hasAddFlagAllPermission:
     checkPermission(AGENCY_PERMISSIONS.ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES, state),
  hasAddFlagCSOPermission:
    checkPermission(AGENCY_PERMISSIONS.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES, state),
  hasVerifyHqPermission: checkPermission(AGENCY_PERMISSIONS.VERIFY_INGO_HQ, state),
  hasVerifyAllCSOPermission: checkPermission(AGENCY_PERMISSIONS.VERIFY_CSOS_GLOBALLY, state),
  hasVerifyAssignedCSOPermission: checkPermission(AGENCY_PERMISSIONS.VERIFY_CSOS_FOR_OWN_COUNTRY, state),
});

export default compose(
  withMultipleDialogHandling,
  withRouter,
  connect(mapStateToProps, null),
)(PartnerProfileHeaderMenu);
