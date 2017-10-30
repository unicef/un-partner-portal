import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import Duplicate from '../../buttons/duplicateButton';
import Complete from '../../buttons/completeCfeiButton';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import CompleteCfeiModal from '../../modals/completeCfei/completeCfeiModal';

const edit = 'edit';
const duplicate = 'duplicate';
const complete = 'complete';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id },
    dialogOpen,
    handleDialogClose,
    handleDialogOpen,
    cfeiCompleted } = props;
  return (
    <SpreadContent>
      {!cfeiCompleted && <Complete handleClick={() => handleDialogOpen(complete)} />}
      <DropdownMenu
        options={
          [
            {
              name: edit,
              content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
            },
            {
              name: duplicate,
              content: <Duplicate id={id} onClick={() => handleDialogOpen(duplicate)} />,
            },
          ]
        }
      />
      {dialogOpen[edit] && <EditCfeiModal
        id={id}
        type="direct"
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[complete] && <CompleteCfeiModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />}
    </SpreadContent>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  cfeiCompleted: PropTypes.bool,
};

export default withMultipleDialogHandling(withRouter(PartnerOpenHeaderOptions));
