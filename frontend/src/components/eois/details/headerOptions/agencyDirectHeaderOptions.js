import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import DeleteButton from '../../buttons/deleteCfeiButton';
import DownloadButton from '../../buttons/downloadCfeiButton';
import Complete from '../../buttons/completeCfeiButton';
import SendDsrButton from '../../buttons/sendDsrButton';
import PublishDsrButton from '../../buttons/publishDsrButton';
import SendDsrModal from '../../modals/completeDsr/sendDsrModal';
import DeleteDsrModal from '../../modals/completeDsr/deleteDsrModal';
import CancelDsrModal from '../../modals/completeDsr/cancelDsrModal';
import EditDateDsrModal from '../../modals/editDsr/editDateDsrModal';
import EditDsrModal from '../../modals/editDsr/editDsrModal';
import PublishDsrModal from '../../modals/completeDsr/publishDsrModal';
import FinalizeDsrModal from '../../modals/completeDsr/finalizeDsrModal';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import { checkPermission, isRoleOffice, AGENCY_ROLES, AGENCY_PERMISSIONS, COMMON_PERMISSIONS } from '../../../../helpers/permissions';
import {
  selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  isUserAFocalPoint,
  isUserACreator,
  selectCfeiDetails,
} from '../../../../store';
import { authorizedFileDownload } from "../../../../helpers/api/api";

const edit = 'edit';
const del = 'del';
const cancel = 'cancel';
const download = 'download';
const send = 'send';
const publish = 'publish';
const complete = 'complete';
const editPublished = 'editPublished';

class AgencyDirectHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.sendOptions = this.sendOptions.bind(this);
    this.publishOptions = this.publishOptions.bind(this);
    this.isActionAllowed = this.isActionAllowed.bind(this);
  }

  sendOptions() {
    const {
      params: { id },
      handleDialogOpen,
      hasEditDraftPermission,
      hasDeleteDraftPermission,
      isFocalPoint,
      isCreator } = this.props;

    const options = [
      {
        name: download,
        content: <DownloadButton handleClick={() => { authorizedFileDownload({uri: `/projects/${id}/?export=pdf`}); }} />,
      },
    ];

    if (hasEditDraftPermission && isCreator
      || hasDeleteDraftPermission && isFocalPoint) {
      options.push(
        {
          name: edit,
          content: <EditButton
            handleClick={() => handleDialogOpen(edit)}
          />,
        });
    }

    if (hasDeleteDraftPermission && isCreator
      || hasDeleteDraftPermission && isFocalPoint) {
      options.push(
        {
          name: del,
          content: <DeleteButton handleClick={() => handleDialogOpen(del)} />,
        });
    }

    return options;
  }

  isActionAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isMFT,
      isPAM,
      isBasEd,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
      || (hasActionPermission && isMFT && isFocalPoint)
      || (hasActionPermission && isBasEd && isCreator)
      || (hasActionPermission && isPAM && isCreator));
  }

  publishOptions() {
    const {
      params: { id },
      handleDialogOpen,
      hasEditSentPermission,
      hasEditPublishedPermission,
      isPublished,
      status,
      isCompleted,
      isAdvEd,
      isMFT,
      isFocalPoint } = this.props;

    const options = [
      {
        name: download,
        content: <DownloadButton handleClick={() => { authorizedFileDownload({uri: `/projects/${id}/?export=pdf`}); }} />,
      },
    ];

    if ((!isCompleted && isPublished && this.isActionAllowed(hasEditPublishedPermission))
      || (!isPublished && status === 'Sen' && ((hasEditSentPermission && isAdvEd && isFocalPoint)
        || (!isCompleted && hasEditPublishedPermission && isMFT && isFocalPoint)))) {
      options.push(
        {
          name: edit,
          content: <EditButton handleClick={() => handleDialogOpen(editPublished)} />,
        });
    }

    return options;
  }

  isPartnerVerified() {
    const { cfei } = this.props;

    if (cfei.direct_selected_partners && cfei.direct_selected_partners.length > 0) {
      return cfei.direct_selected_partners[0].partner_is_verified;
    }

    return false;
  }

  render() {
    const { params: { id },
      isFocalPoint,
      isCreator,
      isPublished,
      isCompleted,
      status,
      dialogOpen,
      hasSendPermission,
      hasPublishPermission,
      hasFinalizePermission,
      isMFT,
      isAdvEd,
      handleDialogClose,
      handleDialogOpen } = this.props;

    return (
      <SpreadContent>
        {!isCompleted && isPublished && this.isActionAllowed(hasFinalizePermission)
          && <Complete handleClick={() => handleDialogOpen(complete)} />}

        {!isCompleted && status === 'Dra' && isCreator && hasSendPermission
          && <SendDsrButton handleClick={() => handleDialogOpen(send)} />}

        {!isPublished && !isCompleted && hasPublishPermission &&
          (((isFocalPoint || isCreator) && isAdvEd) || (isFocalPoint && isMFT))
          && <PublishDsrButton disabled={!this.isPartnerVerified()} handleClick={() => handleDialogOpen(publish)} />}

        <DropdownMenu
          options={status === 'Dra' ? this.sendOptions() : this.publishOptions()}
        />

        {dialogOpen[cancel] && <CancelDsrModal
          id={id}
          dialogOpen={dialogOpen[cancel]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[del] && <DeleteDsrModal
          id={id}
          dialogOpen={dialogOpen[del]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[edit] && <EditDsrModal
          id={id}
          type="direct"
          open={dialogOpen[edit]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[editPublished] && <EditDateDsrModal
          id={id}
          type="direct"
          dialogOpen={dialogOpen[editPublished]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[send] && <SendDsrModal
          id={id}
          type="direct"
          dialogOpen={dialogOpen[send]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[publish] && <PublishDsrModal
          id={id}
          type="direct"
          dialogOpen={dialogOpen[publish]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[complete] && <FinalizeDsrModal
          id={id}
          dialogOpen={dialogOpen[complete]}
          handleDialogClose={handleDialogClose}
        />}
      </SpreadContent>
    );
  }
}

AgencyDirectHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  cfei: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isPublished: PropTypes.bool,
  isCreator: PropTypes.bool,
  hasSendPermission: PropTypes.bool,
  hasPublishPermission: PropTypes.bool,
  hasEditDraftPermission: PropTypes.bool,
  hasDeleteDraftPermission: PropTypes.bool,
  hasEditSentPermission: PropTypes.bool,
  hasEditPublishedPermission: PropTypes.bool,
  hasCancelPermission: PropTypes.bool,
  hasFinalizePermission: PropTypes.bool,
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
  cfei: selectCfeiDetails(state, ownProps.id),
  status: selectCfeiStatus(state, ownProps.id),
  hasSendPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT,
    state),
  hasPublishPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_PUBLISH, state),
  hasEditDraftPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_EDIT_DRAFT, state),
  hasDeleteDraftPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_DELETE_DRAFT, state),
  hasEditSentPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_EDIT_SENT, state),
  hasEditPublishedPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_EDIT_PUBLISHED, state),
  hasCancelPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_CANCEL, state),
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
)(AgencyDirectHeaderOptions);
