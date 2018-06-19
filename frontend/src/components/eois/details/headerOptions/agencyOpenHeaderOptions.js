import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PROJECT_STATUSES } from '../../../../helpers/constants';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import InviteButton from '../../buttons/invitePartner';
import Reviewers from '../../buttons/manageReviewers';
import Complete from '../../buttons/completeCfeiButton';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import AddInformedPartners from '../../modals/callPartners/addInformedPartners';
import ManageReviewersModal from '../../modals/manageReviewers/manageReviewersModal';
import CompleteCfeiModal from '../../modals/completeCfei/completeCfeiModal';
import CancelCfeiModal from '../../modals/completeCfei/cancelCfeiModal';
import SendCfeiButton from '../../buttons/sendCfeiButton';
import DeleteButton from '../../buttons/deleteCfeiButton';
import PublishCfeiButton from '../../buttons/publishCfeiButton';
import SendCfeiModal from '../../modals/completeCfei/sendCfeiModal';
import PublishCfeiModal from '../../modals/completeCfei/publishCfeiModal';
import { checkPermission, isRoleOffice, AGENCY_ROLES, AGENCY_PERMISSIONS, COMMON_PERMISSIONS } from '../../../../helpers/permissions';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiDeadlinePassed,
  isCfeiCompleted,
  isUserAFocalPoint,
  isDeadlinePassed,
  isUserACreator,
} from '../../../../store';
import CancelCfeiButton from '../../buttons/cancelCfeiButton';

const del = 'del';
const edit = 'edit';
const cancel = 'cancel';
const invite = 'invite';
const manage = 'manage';
const complete = 'complete';
const send = 'send';
const publish = 'publish';

class PartnerOpenHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.sendOptions = this.sendOptions.bind(this);
    this.isPuslishPermissionAllowed = this.isPuslishPermissionAllowed.bind(this);
  }

  isPuslishPermissionAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isPAM,
      isBasEd,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
    || (hasActionPermission && isBasEd && isCreator)
    || (hasActionPermission && isPAM && isCreator));
  }

  sendOptions() {
    const {
      handleDialogOpen,
      hasManageDraftPermission,
      hasInviteSentPermission,
      hasEditSentPermission,
      hasInvitePublishPermission,
      hasCancelPublishPermission,
      status,
      isPublished,
      isFocalPoint,
      isCreator } = this.props;

    const options = [];

    if ((hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA)
        || (hasEditSentPermission && isFocalPoint)) {
      options.push(
        {
          name: edit,
          content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
        });
    }

    if ((hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA)
    || (hasInviteSentPermission && isFocalPoint && status === PROJECT_STATUSES.SEN)
    || (isPublished && this.isPuslishPermissionAllowed(hasInvitePublishPermission))) {
      options.push(
        {
          name: invite,
          content: <InviteButton handleClick={() => handleDialogOpen(invite)} />,
        });
    }

    // TODO
    if (isPublished && isCreator) {
      options.push(
        {
          name: manage,
          content: <Reviewers handleClick={() => handleDialogOpen(manage)} />,
        });
    }

    if (hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA) {
      options.push(
        {
          name: del,
          content: <DeleteButton handleClick={() => handleDialogOpen(del)} />,
        });
    }

    if (isPublished && this.isPuslishPermissionAllowed(hasCancelPublishPermission)) {
      options.push(
        {
          name: cancel,
          content: <CancelCfeiButton handleClick={() => handleDialogOpen(cancel)} />,
        });
    }

    return options;
  }

  render() {
    const { params: { id },
      isCompleted,
      isCreator,
      isFocalPoint,
      isPublished,
      status,
      isDeadlinePassed,
      isAdvEd,
      isPAM,
      hasPublishPermission,
      hasSendPermission,
      hasFinalizePermission,
      dialogOpen,
      handleDialogClose,
      handleDialogOpen } = this.props;
console.log(isDeadlinePassed)
    return (
      <SpreadContent>
        {isPublished && this.isPuslishPermissionAllowed(hasFinalizePermission)
          && <Complete handleClick={() => handleDialogOpen(complete)} />}

        {!isCompleted && status === PROJECT_STATUSES.DRA && isCreator && hasSendPermission &&
        <SendCfeiButton handleClick={() => handleDialogOpen(send)} />}

        {!isPublished && !isCompleted && hasPublishPermission &&
            (((isFocalPoint || isCreator) && isAdvEd) || (isCreator && isPAM))
         && <PublishCfeiButton disabled={isDeadlinePassed} handleClick={() => handleDialogOpen(publish)} />}

        <DropdownMenu
          options={this.sendOptions()}
        />

        {dialogOpen[cancel] && <CancelCfeiModal
          id={id}
          dialogOpen={dialogOpen[cancel]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[publish] && <PublishCfeiModal
          id={id}
          type="open"
          dialogOpen={dialogOpen[publish]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[send] && <SendCfeiModal
          id={id}
          type="open"
          dialogOpen={dialogOpen[send]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[edit] && <EditCfeiModal
          id={id}
          type="open"
          dialogOpen={dialogOpen[edit]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[invite] && <AddInformedPartners
          id={id}
          dialogOpen={dialogOpen[invite]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[manage] && <ManageReviewersModal
          id={id}
          dialogOpen={dialogOpen[manage]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[complete] && <CompleteCfeiModal
          id={id}
          dialogOpen={dialogOpen[complete]}
          handleDialogClose={handleDialogClose}
        />}
      </SpreadContent>
    );
  }
}

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isPublished: PropTypes.bool,
  isCreator: PropTypes.bool,
  hasManageDraftPermission: PropTypes.bool,
  hasSendPermission: PropTypes.bool,
  hasInviteSentPermission: PropTypes.bool,
  hasEditSentPermission: PropTypes.bool,
  hasInvitePublishPermission: PropTypes.bool,
  hasCancelPublishPermission: PropTypes.bool,
  hasPublishPermission: PropTypes.bool,
  hasEditPublishedPermission: PropTypes.bool,
  hasFinalizePermission: PropTypes.bool,
  isDeadlinePassed: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  isCompleted: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
  status: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  isCreator: isUserACreator(state, ownProps.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.id),
  isCompleted: isCfeiCompleted(state, ownProps.id),
  isPublished: isCfeiPublished(state, ownProps.id),
  isDeadlinePassed: isDeadlinePassed(state, ownProps),
  isPublished: isCfeiPublished(state, ownProps.id),
  isDeadlinePassed: isCfeiDeadlinePassed(state, ownProps.id),
  status: selectCfeiStatus(state, ownProps.id),
  hasManageDraftPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DRAFT_MANAGE, state),
  hasSendPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
    state),

  hasInviteSentPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_SENT_INVITE_CSO, state),
  hasPublishPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISH, state)
    || checkPermission(AGENCY_PERMISSIONS.CFEI_SENT_PUBLISH, state),
  hasEditSentPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_SENT_EDIT, state),
  hasInvitePublishPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISHED_INVITE_CSO, state),
  hasCancelPublishPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISHED_CANCEL, state),
  // dsr permission
  hasEditPublishedPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_EDIT_PUBLISHED, state),
  hasFinalizePermission: checkPermission(COMMON_PERMISSIONS.CFEI_FINALIZE, state),

  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
  isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
  isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
});


export default compose(
  withMultipleDialogHandling,
  connect(mapStateToProps, null),
  withRouter,
)(PartnerOpenHeaderOptions);
