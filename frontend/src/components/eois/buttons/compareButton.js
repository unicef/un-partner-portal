import React from 'react';
import PropTypes from 'prop-types';
import Compare from 'material-ui-icons/CompareArrows';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import CompareModal from '../modals/compareApplications/compareApplicationsModal';

const messages = {
  text: 'Compare',
};

const CompareButton = (props) => {
  const { id, rows, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <div>
      <IconWithTooltipButton
        id={id}
        icon={<Compare />}
        name="compare"
        text={messages.text}
        onClick={handleDialogOpen}
        {...other}
      />
      <CompareModal
        applications={rows.map(row => row.id)}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
};

CompareButton.propTypes = {
  id: PropTypes.number,
  rows: PropTypes.array,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

export default withDialogHandling(CompareButton);
