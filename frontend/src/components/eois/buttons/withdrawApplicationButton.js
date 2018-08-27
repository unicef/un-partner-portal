import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import WithdrawApplicationModal from '../modals/withdrawApplication/withdrawApplicationModal';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import ButtonWithTooltip from '../../common/buttonWithTooltipEnabled';

const messages = {
  withdraw: 'retract selection',
  decision: 'Decision made by partner',
};

const WithdrawApplicationButton = (props) => {
  const {
    applicationId,
    handleDialogClose,
    handleDialogOpen,
    dialogOpen,
    onUpdate,
    disabled,
    ...other
  } = props;
console.log(disabled);
  return (
    <Grid item>
      {disabled ?
        <ButtonWithTooltip
          name="retract"
          disabled
          text={messages.withdraw}
          tooltipText={messages.decision}
          onClick={handleDialogOpen}
        />
        : <Button
          color="accent"
          onClick={handleDialogOpen}
          {...other}
        >
          {messages.withdraw}
        </Button>}
      <WithdrawApplicationModal
        applicationId={applicationId}
        onUpdate={onUpdate}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>
  );
};


WithdrawApplicationButton.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  onUpdate: PropTypes.func,
  disabled: PropTypes.bool,
};

export default withDialogHandling(WithdrawApplicationButton);
