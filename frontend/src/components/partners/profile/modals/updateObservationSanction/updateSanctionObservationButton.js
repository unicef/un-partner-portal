import React from 'react';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Create from 'material-ui-icons/Create';
import IconWithTextButton from '../../../../../components/common/iconWithTextButton';
import withMultipleDialogHandling from '../../../../../components/common/hoc/withMultipleDialogHandling';
import UpdateSanctionObservationModal from './updateSanctionObservationModal';

const styleSheet = theme => ({
  grey: {
    color: theme.palette.primary[700],
    '&:hover': {
      color: theme.palette.primary[900],
    },
  },
});

const update = 'update';

const UpdateSanctionObservationButton = (props) => {
  const { id,
    classes,
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;

  return (
    <div>
      <IconWithTextButton
        id={id}
        icon={<Create className={classes.grey} />}
        name="edit"
        onClick={(e) => {
          e.stopPropagation();
          handleDialogOpen(update);
        }}
      /> {dialogOpen[update] && <UpdateSanctionObservationModal
        id={id}
        dialogOpen={dialogOpen[update]}
        handleDialogClose={handleDialogClose}
      />}
    </div>
  );
};

UpdateSanctionObservationButton.propTypes = {
  id: PropTypes.number,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default compose(
  withMultipleDialogHandling,
  withRouter,
  withStyles(styleSheet, { name: 'updateSanctionObservationButton' }),
)(UpdateSanctionObservationButton);
