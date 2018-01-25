import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
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
import withConditionalDisplay from '../../../common/hoc/withConditionalDisplay';
import { isUserNotAgencyReader } from '../../../../helpers/authHelpers';

const edit = 'edit';
const invite = 'invite';
const manage = 'manage';
const complete = 'complete';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id },
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;
  return (
    <SpreadContent>
      <Complete handleClick={() => handleDialogOpen(complete)} />
      <DropdownMenu
        options={
          [
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
          ]
        }
      />
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
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default compose(
  withMultipleDialogHandling,
  withRouter,
  withConditionalDisplay([isUserNotAgencyReader]),
)(PartnerOpenHeaderOptions);
