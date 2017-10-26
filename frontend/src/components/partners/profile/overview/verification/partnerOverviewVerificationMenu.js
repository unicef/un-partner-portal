
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../../common/dropdownMenu';
import AddNewVerificationButton from '../../buttons/addNewVerificationButton';
import withDialogHandling from '../../../../common/hoc/withDialogHandling';
import AddVerificationModal from '../../modals/addVerificationModal/addVerificationModal';

const PartnerOverviewVerificationMenu = (props) => {
  const { params: { id }, dialogOpen, handleDialogClose, handleDialogOpen } = props;
  return (
    <div>
      <DropdownMenu
        options={
          [
            {
              name: 'addNewVerification',
              content: <AddNewVerificationButton handleClick={() => handleDialogOpen()} />,
            },
          ]
        }
      />
      {dialogOpen && <AddVerificationModal
        partnerId={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

PartnerOverviewVerificationMenu.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withDialogHandling(withRouter(PartnerOverviewVerificationMenu));
