
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../../common/dropdownMenu';
import FlagYellowButton from '../../buttons/flagYellowButton';
import FlagRedButton from '../../buttons/flagRedButton';
import withMultipleDialogHandling from '../../../../common/hoc/withMultipleDialogHandling';
import { FLAGS } from '../../../../../helpers/constants';
import AddFlagModal from '../../modals/addFlagModal/addFlagModal';

const { RED, YELLOW } = FLAGS;

const PartnerOverviewFlagMenu = (props) => {
  const { params: { id },
    dialogOpen,
    handleDialogClose,
    handleDialogOpen,
  } = props;
  return (
    <div>
      <DropdownMenu
        options={
          [
            {
              name: YELLOW,
              content: <FlagYellowButton handleClick={() => handleDialogOpen(YELLOW)} />,
            },
            {
              name: RED,
              content: <FlagRedButton handleClick={() => handleDialogOpen(RED)} />,
            },
          ]
        }
      />
      {dialogOpen[YELLOW] && <AddFlagModal
        partnerId={id}
        flag={YELLOW}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[RED] && <AddFlagModal
        partnerId={id}
        flag={RED}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

PartnerOverviewFlagMenu.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withMultipleDialogHandling(withRouter(PartnerOverviewFlagMenu));
