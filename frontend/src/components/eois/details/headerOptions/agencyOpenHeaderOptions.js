import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import EditButton from '../../buttons/editCfeiButton';
import InviteButton from '../../buttons/invitePartner';
import Reviewers from '../../buttons/manageReviewers';
import Duplicate from '../../buttons/duplicateButton';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import AddInformedPartners from '../../modals/callPartners/addInformedPartners';
import ManageReviewersModal from '../../modals/manageReviewers/manageReviewersModal';


const edit = 'edit';
const invite = 'invite';
const manage = 'manage';
const duplicate = 'duplicate';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id },
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;
  return (
    <div>
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
            {
              name: duplicate,
              content: <Duplicate id={id} onClick={() => handleDialogOpen(duplicate)} />,
            },
          ]
        }
      />
      {dialogOpen[edit] && <EditCfeiModal
        id={id}
        type="open"
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[invite] && <AddInformedPartners
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[manage] && <ManageReviewersModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withMultipleDialogHandling(withRouter(PartnerOpenHeaderOptions));
