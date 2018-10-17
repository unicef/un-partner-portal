import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import ButtonWithTooltipEnabled from '../../common/buttonWithTooltipEnabled';
import ConvertToDirectSelectionModal from '../modals/convertToDirectSelection/convertToDirectSelectionModal';

const messages = {
  label: 'Convert to Direct Selection/Retention',
  tooltipInfo: 'This UCN cannot be converted as partner does not have a \'verification passed\' status. The partner must be verified in order to proceed.',
};

const ConvertToDS = (props) => {
  const {
    id,
    handleDialogClose,
    handleDialogOpen,
    dialogOpen,
    partnerVerified,
  } = props;

  return (
    <Grid item>
      {!partnerVerified
        ? <ButtonWithTooltipEnabled
          name="publish"
          text={messages.label}
          tooltipText={messages.tooltipInfo}
          disabled
        />
        : <Button
          raised
          color="accent"
          onClick={handleDialogOpen}
        >
          {messages.label}
        </Button>}
      <ConvertToDirectSelectionModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>);
};

ConvertToDS.propTypes = {
  id: PropTypes.string,
  dialogOpen: PropTypes.bool,
  partnerVerified: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withDialogHandling(ConvertToDS);
