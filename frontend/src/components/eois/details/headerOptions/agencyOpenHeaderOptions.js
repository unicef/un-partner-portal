import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
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
import SendCfeiButton from '../../buttons/sendCfeiButton';
import PublishCfeiButton from '../../buttons/publishCfeiButton';
import SendCfeiModal from '../../modals/completeCfei/sendCfeiModal';
import PublishCfeiModal from '../../modals/completeCfei/publishCfeiModal';
import { checkPermission, isRoleOffice, AGENCY_ROLES, AGENCY_PERMISSIONS, COMMON_PERMISSIONS } from '../../../../helpers/permissions';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  isUserAFocalPoint,
  isDeadlinePassed,
  isUserACreator,
} from '../../../../store';

const edit = 'edit';
const invite = 'invite';
const manage = 'manage';
const complete = 'complete';
const send = 'send';
const publish = 'publish';

class PartnerOpenHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.sendOptions = this.sendOptions.bind(this);
    this.isActionAllowed = this.isActionAllowed.bind(this);
  }

  isActionAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isMFT,
      isPAM,
      isBasEd,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && isCreator && isFocalPoint)
    || (hasActionPermission && isMFT && isFocalPoint)
    || (hasActionPermission && isBasEd && isCreator)
    || (hasActionPermission && isPAM && isCreator));
  }
  
  sendOptions() {
    const {
      handleDialogOpen,
      hasEditDraftPermission,
      hasDeleteDraftPermission,
      isCreator } = this.props;

    const options = [
      {
        name: edit,
        content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
      },
      {
        name: invite,
        content: <InviteButton handleClick={() => handleDialogOpen(invite)} />,
      },
      {
        name: manage,
        content: <Reviewers handleClick={() => handleDialogOpen(manage)} />,
      },
    ];
 
    return options;
  }


  render() {
    const { params: { id },
      dialogOpen,
      handleDialogClose,
      handleDialogOpen } = this.props;
    return (
      <SpreadContent>
        <Complete handleClick={() => handleDialogOpen(complete)} />
        <SendCfeiButton handleClick={() => handleDialogOpen(send)} />
        <PublishCfeiButton handleClick={() => handleDialogOpen(publish)} />
        <DropdownMenu
          options={this.sendOptions()}
        />
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
  isDeadlinePassed: isDeadlinePassed(state, ownProps),
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
)(PartnerOpenHeaderOptions);
