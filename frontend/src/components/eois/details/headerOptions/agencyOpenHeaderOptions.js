import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PROJECT_STATUSES } from '../../../../helpers/constants';
import { authorizedFileDownload } from '../../../../helpers/api/api';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import DownloadButton from '../../buttons/downloadCfeiButton';
import InviteButton from '../../buttons/invitePartner';
import Reviewers from '../../buttons/manageReviewers';
import Complete from '../../buttons/completeCfeiButton';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import EditDateCfeiModal from '../../modals/editCfei/editDateCfeiModal';
import AddInformedPartners from '../../modals/callPartners/addInformedPartners';
import ManageReviewersModal from '../../modals/manageReviewers/manageReviewersModal';
import CompleteCfeiModal from '../../modals/completeCfei/completeCfeiModal';
import CancelCfeiModal from '../../modals/completeCfei/cancelCfeiModal';
import DeleteCfeiModal from '../../modals/completeCfei/deleteCfeiModal';
import SendCfeiButton from '../../buttons/sendCfeiButton';
import DeleteButton from '../../buttons/deleteCfeiButton';
import PublishCfeiButton from '../../buttons/publishCfeiButton';
import SendCfeiModal from '../../modals/completeCfei/sendCfeiModal';
import PublishCfeiModal from '../../modals/completeCfei/publishCfeiModal';
import { checkPermission, isRoleOffice, AGENCY_ROLES, AGENCY_PERMISSIONS, COMMON_PERMISSIONS } from '../../../../helpers/permissions';
import {
  selectCfeiStatus,
  isCfeiPublished,
  isCfeiDeadlinePassed,
  isCfeiCompleted,
  isUserAFocalPoint,
  isUserACreator,
  cfeiHasRecommendedPartner,
  isSendForDecision,
  isCfeiClarificationDeadlinePassed,
} from '../../../../store';
import CancelCfeiButton from '../../buttons/cancelCfeiButton';

const messages = {
  updateDeadlineDate: 'Update Application Deadline date to publish this CFEI',
  updateClarificationDate: 'Update Application Clarificatin Deadline date to publish this CFEI',
}

const del = 'del';
const edit = 'edit';
const cancel = 'cancel';
const invite = 'invite';
const manage = 'manage';
const complete = 'complete';
const send = 'send';
const publish = 'publish';
const editDate = 'editDate';
const download = 'download';

class PartnerOpenHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.sendOptions = this.sendOptions.bind(this);
    this.isPuslishPermissionAllowed = this.isPuslishPermissionAllowed.bind(this);
  }

  isFinalizeAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isPAM,
      isBasEd,
      isMFT,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
      || (hasActionPermission && isBasEd && isCreator)
      || (hasActionPermission && isMFT && isFocalPoint)
      || (hasActionPermission && isPAM && isCreator));
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
      params: { id },
      handleDialogOpen,
      hasManageDraftPermission,
      hasInviteSentPermission,
      hasEditSentPermission,
      hasEditPublishedDatesPermission,
      hasInvitePublishPermission,
      hasCancelPublishPermission,
      hasManageReviewersPermission,
      hasRecommendedPartner,
      isSend,
      status,
      isPublished,
      isDeadlinePassed,
      isFocalPoint,
      isCreator } = this.props;

    const options = [
      {
        name: download,
        content: <DownloadButton handleClick={() => { authorizedFileDownload({ uri: `/projects/${id}/?export=pdf` }); }} />,
      },
    ];

    if (((hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA)
      || (hasEditSentPermission && isFocalPoint)) && !isPublished) {
      options.push(
        {
          name: edit,
          content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
        });
    }

    if (this.isPuslishPermissionAllowed(hasEditPublishedDatesPermission)
      && isPublished) {
      options.push(
        {
          name: editDate,
          content: <EditButton handleClick={() => handleDialogOpen(editDate)} />,
        });
    }

    if (((hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA)
      || (hasInviteSentPermission && isFocalPoint && status === PROJECT_STATUSES.SEN)
      || (isPublished && this.isPuslishPermissionAllowed(hasInvitePublishPermission)))
      && !isDeadlinePassed) {
      options.push(
        {
          name: invite,
          content: <InviteButton handleClick={() => handleDialogOpen(invite)} />,
        });
    }

    if (!hasRecommendedPartner
      && !isSend
      && isPublished
      && this.isPuslishPermissionAllowed(hasManageReviewersPermission)) {
      options.push(
        {
          name: manage,
          content: <Reviewers handleClick={() => handleDialogOpen(manage)} />,
        });
    }

    if (!isPublished && (hasManageDraftPermission && isCreator && status === PROJECT_STATUSES.DRA
      || (hasEditSentPermission && isFocalPoint))) {
      options.push(
        {
          name: del,
          content: <DeleteButton handleClick={() => handleDialogOpen(del)} />,
        });
    }

    if (!isPublished && this.isPuslishPermissionAllowed(hasCancelPublishPermission)) {
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
      isClarificationRequestPassed,
      isAdvEd,
      isPAM,
      hasPublishPermission,
      hasSendPermission,
      hasFinalizePermission,
      dialogOpen,
      handleDialogClose,
      handleDialogOpen } = this.props;

    return (
      <SpreadContent>
        {isPublished && this.isFinalizeAllowed(hasFinalizePermission)
          && <Complete handleClick={() => handleDialogOpen(complete)} />}

        {!isCompleted && status === PROJECT_STATUSES.DRA && isCreator && hasSendPermission && !isPAM &&
          <SendCfeiButton handleClick={() => handleDialogOpen(send)} />}

        {!isPublished && !isCompleted && hasPublishPermission &&
          (((isFocalPoint || isCreator) && isAdvEd) || (isCreator && isPAM))
          && <PublishCfeiButton tooltipInfo={isDeadlinePassed && messages.updateDeadlineDate || isClarificationRequestPassed && messages.updateClarificationDate}
            disabled={isDeadlinePassed || isClarificationRequestPassed} handleClick={() => handleDialogOpen(publish)} />}

        <DropdownMenu
          options={this.sendOptions()}
        />

        {dialogOpen[del] && <DeleteCfeiModal
          id={id}
          dialogOpen={dialogOpen[del]}
          handleDialogClose={handleDialogClose}
        />}
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
        {dialogOpen[editDate] && <EditDateCfeiModal
          id={id}
          type="open"
          dialogOpen={dialogOpen[editDate]}
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
  isFocalPoint: PropTypes.bool,
  hasManageDraftPermission: PropTypes.bool,
  hasSendPermission: PropTypes.bool,
  hasInviteSentPermission: PropTypes.bool,
  hasEditSentPermission: PropTypes.bool,
  hasInvitePublishPermission: PropTypes.bool,
  hasCancelPublishPermission: PropTypes.bool,
  hasPublishPermission: PropTypes.bool,
  hasEditPublishedDatesPermission: PropTypes.bool,
  hasManageReviewersPermission: PropTypes.bool,
  hasFinalizePermission: PropTypes.bool,
  hasRecommendedPartner: PropTypes.bool,
  isDeadlinePassed: PropTypes.bool,
  isClarificationRequestPassed: PropTypes.bool,
  isCompleted: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
  isSend: PropTypes.bool,
  status: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  isCreator: isUserACreator(state, ownProps.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.id),
  isCompleted: isCfeiCompleted(state, ownProps.id),
  isPublished: isCfeiPublished(state, ownProps.id),
  isDeadlinePassed: isCfeiDeadlinePassed(state, ownProps.id),
  isClarificationRequestPassed: isCfeiClarificationDeadlinePassed(state, ownProps.id),
  hasRecommendedPartner: cfeiHasRecommendedPartner(state, ownProps.id),
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
  hasManageReviewersPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_MANAGE_REVIEWERS, state),
  hasFinalizePermission: checkPermission(COMMON_PERMISSIONS.CFEI_FINALIZE, state),
  hasEditPublishedDatesPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISHED_EDIT_DATES, state),
  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
  isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
  isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
  isSend: isSendForDecision(state, ownProps.id),
});


export default compose(
  withMultipleDialogHandling,
  connect(mapStateToProps, null),
  withRouter,
)(PartnerOpenHeaderOptions);
