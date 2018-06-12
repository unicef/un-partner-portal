import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import SubmitUcnButton from '../../buttons/submitUcnButton';
import DeleteUcnModal from '../../modals/submitUcn/deleteUcnModal';
import DeleteButton from '../../buttons/deleteCfeiButton';
import SpreadContent from '../../../common/spreadContent';
import DropdownMenu from '../../../common/dropdownMenu';
import SubmitUcnModal from '../../modals/submitUcn/submitUcnModal';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import { checkPermission, COMMON_PERMISSIONS, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';
import { selectCfeiStatus } from '../../../../store';
import { PROJECT_STATUSES } from '../../../../helpers/constants';

const submit = 'submit';
const del = 'delete';

class PartnerUcnHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.extraOptions = this.extraOptions.bind(this);
  }

  extraOptions() {
    const {
      handleDialogOpen,
      hasDeletePermission } = this.props;

    const options = [];

    if (hasDeletePermission) {
      options.push(
        {
          name: del,
          content: <DeleteButton handleClick={() => handleDialogOpen(del)} />,
        });
    }

    return options;
  }

  render() {
    const { params: { id }, hasSubmitPermission,
      status,
      handleDialogOpen,
      dialogOpen,
      handleDialogClose } = this.props;

    return (
      <SpreadContent>
        {status === PROJECT_STATUSES.DRA && hasSubmitPermission
          && <SubmitUcnButton handleClick={() => handleDialogOpen(submit)} />}

        {status === PROJECT_STATUSES.DRA
          && this.extraOptions().length > 0
          && <DropdownMenu
            options={this.extraOptions()}
          />}

        {dialogOpen[submit] && <SubmitUcnModal
          id={id}
          dialogOpen={dialogOpen[submit]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[del] && <DeleteUcnModal
          id={id}
          dialogOpen={dialogOpen[del]}
          handleDialogClose={handleDialogClose}
        />}
      </SpreadContent>
    );
  }
}

PartnerUcnHeaderOptions.propTypes = {
  params: PropTypes.object,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  hasSubmitPermission: PropTypes.bool,
  hasDeletePermission: PropTypes.bool,
  status: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => ({
  status: selectCfeiStatus(state, ownProps.id),
  hasSubmitPermission: checkPermission(PARTNER_PERMISSIONS.UCN_SUBMIT, state),
  hasDeletePermission: checkPermission(PARTNER_PERMISSIONS.UCN_DELETE, state),
  hasFinalizePermission: checkPermission(COMMON_PERMISSIONS.CFEI_FINALIZE, state),
});


export default compose(
  withMultipleDialogHandling,
  connect(mapStateToProps, null),
  withRouter,
)(PartnerUcnHeaderOptions);
