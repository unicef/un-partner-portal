import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent';
import EditButton from '../../buttons/editCfeiButton';
import Complete from '../../buttons/completeCfeiButton';
import SendDsrButton from '../../buttons/sendDsrButton';
import SendDsrModal from '../../modals/completeDsr/sendDsrModal';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import EditCfeiModal from '../../modals/editCfei/editCfeiModal';
import CompleteCfeiModal from '../../modals/completeCfei/completeCfeiModal';
import withConditionalDisplay from '../../../common/hoc/withConditionalDisplay';
import { isUserNotAgencyReader } from '../../../../helpers/authHelpers';

const edit = 'edit';
const send = 'send';
const publish = 'publish';
const complete = 'complete';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id },
    dialogOpen,
    handleDialogClose,
    handleDialogOpen } = props;
  return (
    <SpreadContent>
      <Complete handleClick={() => handleDialogOpen(complete)} />
      <SendDsrButton handleClick={() => handleDialogOpen(send)} />
      <DropdownMenu
        options={
          [
            {
              name: edit,
              content: <EditButton handleClick={() => handleDialogOpen(edit)} />,
            },
          ]
        }
      />
      {dialogOpen[edit] && <EditCfeiModal
        id={id}
        type="direct"
        dialogOpen={dialogOpen[edit]}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[send] && <SendDsrModal
        id={id}
        type="direct"
        dialogOpen={dialogOpen[send]}
        handleDialogClose={handleDialogClose}
      />}
      {dialogOpen[complete] && <CompleteCfeiModal
        id={id}
        dialogOpen={dialogOpen[complete]}
        handleDialogClose={handleDialogClose}
      />}
    </SpreadContent>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isPublished: PropTypes.bool,
};

export default compose(
  withMultipleDialogHandling,
  withRouter,
  withConditionalDisplay([isUserNotAgencyReader]),
)(PartnerOpenHeaderOptions);
