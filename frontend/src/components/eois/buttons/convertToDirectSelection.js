import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import withDialogHandling from '../../common/hoc/withDialogHandling';

const messages = {
  label: 'Convert to DS',
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
