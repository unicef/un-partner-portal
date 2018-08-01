
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../../common/dropdownMenu';
import AddVendorNumber from '../../buttons/addVendorNumber';
import withDialogHandling from '../../../../common/hoc/withDialogHandling';
import AddVendorNumberModal from './partnerVendor/addVendorNumberModal';

const PartnerUNdataDetailsMenu = (props) => {
  const { params: { id }, dialogOpen, handleDialogClose, handleDialogOpen } = props;
  return (
    <div>
      <DropdownMenu
        options={
          [
            {
              name: 'addVendorNumber',
              content: <AddVendorNumber handleClick={() => handleDialogOpen()} />,
            },
          ]
        }
      />
      {dialogOpen && <AddVendorNumberModal
        partnerId={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

PartnerUNdataDetailsMenu.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withDialogHandling(withRouter(PartnerUNdataDetailsMenu));
