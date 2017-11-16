import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import ConvertToDirectSelectionModal from '../modals/convertToDirectSelection/convertToDirectSelectionModal';

const messages = {
  label: 'Convert to Direct Selection',
};

const ConvertToDS = (props) => {
  const { id, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <Grid item>
      <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
        {...other}
      >
        {messages.label}
      </Button>
      <ConvertToDirectSelectionModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


ConvertToDS.propTypes = {
  id: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(ConvertToDS);
