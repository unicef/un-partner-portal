import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import Complete from '../../buttons/completeCfeiButton';
import SendDsrButton from '../../buttons/sendDsrButton';
import PublishDsrButton from '../../buttons/publishDsrButton';
import SendDsrModal from '../../modals/completeDsr/sendDsrModal';
import PublishDsrModal from '../../modals/completeDsr/publishDsrModal';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import CompleteCfeiModal from '../../modals/completeCfei/completeCfeiModal';
import { checkPermission, isRoleOffice, AGENCY_ROLES, AGENCY_PERMISSIONS } from '../../../../helpers/permissions';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../store';

const edit = 'edit';
const send = 'send';
const publish = 'publish';
const complete = 'complete';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id },
    isFocalPoint,
    isCreator,
    isPublished,
    isCompleted,
    status,
    dialogOpen,
    hasSendPermission,
    hasPublishPermission,
    isMFT,
    isAdvEd,
    handleDialogClose,
    handleDialogOpen } = props;

  console.log(isPublished, isCreator, status, isCompleted, hasPublishPermission);
  return (
    <SpreadContent>
      {isPublished && <Complete handleClick={() => handleDialogOpen(complete)} />}
      {!isCompleted && status === 'Dra' && isCreator && hasSendPermission && <SendDsrButton handleClick={() => handleDialogOpen(send)} />}
      {!isPublished && !isCompleted && status === 'Sen' && hasPublishPermission &&
      (((isFocalPoint || isCreator) && isAdvEd) || (isFocalPoint && isMFT)) && <PublishDsrButton handleClick={() => handleDialogOpen(publish)} />}
      <DropdownMenu
        options={
          [
            {
              name: edit,
              content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
            },
          ]
        }
      />
      {dialogOpen[edit] && <EditCfeiModal
        id={id}
        type="direct"
        dialogOpen={dialogOpen[edit]}
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
      {dialogOpen[complete] && <CompleteCfeiModal
        id={id}
        dialogOpen={dialogOpen[complete]}
        handleDialogClose={handleDialogClose}
      />}
    </SpreadContent>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isPublished: PropTypes.bool,
  isCreator: PropTypes.bool,
  hasSendPermission: PropTypes.bool,
  hasPublishPermission: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  isCompleted: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  status: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => ({
  isCreator: isUserACreator(state, ownProps.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.id),
  isCompleted: isCfeiCompleted(state, ownProps.id),
  isPublished: isCfeiPublished(state, ownProps.id),
  status: selectCfeiStatus(state, ownProps.id),
  hasSendPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT, state),
  hasPublishPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_PUBLISH, state),
  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
});


export default compose(
  withMultipleDialogHandling,
  connect(mapStateToProps, null),
  withRouter,
)(PartnerOpenHeaderOptions);
