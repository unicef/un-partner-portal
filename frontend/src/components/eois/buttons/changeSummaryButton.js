import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ChangeSummaryModal from '../modals/changeSummary/changeSummaryModal';
import withDialogHandling from '../../common/hoc/withDialogHandling';

const messages = {
  labelAdd: 'add summary',
  labelEdit: 'edit',
};


const ChangeSummary = (props) => {
  const { cfeiId, edit, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <Grid container justify="flex-end" >
      <Grid item>
        <Button
          color="accent"
          onClick={handleDialogOpen}
          {...other}
        >
          {edit ? messages.labelEdit : messages.labelAdd}
        </Button>
        <ChangeSummaryModal
          cfeiId={cfeiId}
          edit={edit}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      </Grid>
    </Grid>

  );
};


ChangeSummary.propTypes = {
  cfeiId: PropTypes.string,
  edit: PropTypes.bool,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(ChangeSummary);
