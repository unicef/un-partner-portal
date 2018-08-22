import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import SendRecommendedPartnerModal from '../modals/recommendPartner/sendRecommendedPartnerModal';

const messages = {
  text: 'Send',
};

const SendRecommendedPartnerButton = (props) => {
  const { id, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <div>
      <Button
        id={id}
        raised
        color="accent"
        onTouchTap={handleDialogOpen}
      >
        {messages.text}
      </Button>
      <SendRecommendedPartnerModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
};

SendRecommendedPartnerButton.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withDialogHandling(SendRecommendedPartnerButton);
