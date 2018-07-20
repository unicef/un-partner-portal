
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
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

class PartnerProfileHeaderMenu extends Component {
  constructor(props) {
    super(props);

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
          content: <AddNewVerificationButton handleClick={() => handleDialogOpen(addVerification)} />,
        });
    }

    if (hasAddFlagAllPermission
      || (hasAddFlagCSOPermission && !partnerProfile.isHq
          && agencyCountryCode === partnerProfile.countryCode)) {
      options.push(
        {
          name: addObservation,
          content: <AddNewObservationButton handleClick={() => handleDialogOpen(addObservation)} />,
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
