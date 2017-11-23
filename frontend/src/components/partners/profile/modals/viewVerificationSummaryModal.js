import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import Typography from 'material-ui/Typography';
import ControlledModal from '../../../common/modals/controlledModal';
import { updatePartnerVerifications } from '../../../../reducers/partnerVerifications';
import AddVerificationForm from './addVerificationModal/addVerificationForm';
import VerificationConfirmation from './addVerificationModal/verificationConfirmation';
import { formatDateForPrint } from '../../../../helpers/dates';
import GridColumn from '../../../common/grid/gridColumn';
import SpreadContent from '../../../common/spreadContent';

const messages = {
  title: 'Verification details',
  header: 'Verified by',
  save: 'verify',
  confirmation: 'Confirmation',
};


const AddVerificationModal = (props) => {
  const { submit, dialogOpen, handleDialogClose, verification } = props;
  return (
    <div>
      <ControlledModal
        maxWidth="md"
        title={messages.title}
        trigger={dialogOpen}
        handleDialogClose={handleDialogClose}
        info={{
          title: <SpreadContent>
            <div>
              {`${messages.header} ${R.path(['submitter', 'name'], verification)} ${R.path(['submitter', 'agency_name'], verification)}`}
            </div>
            <div>
              {formatDateForPrint(verification.created)}
            </div>
          </SpreadContent>,
        }}
        buttons={{}}
        content={<GridColumn alignItems="center">
          <VerificationConfirmation verification={verification} />
          <AddVerificationForm readOnly initialValues={verification} />
        </GridColumn>}
      />
    </div >
  );
};


AddVerificationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  verification: PropTypes.object,
  handleDialogClose: PropTypes.func,
};


const mapStateToProps = (state, ownProps) => {
  const partnerName = state.partnerNames[ownProps.partnerId];
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addVerification: body => dispatch(updatePartnerVerifications(
      partnerId, body)),
    submit: () => dispatch(submit('addVerification')),
  };
};

const containerAddVerificationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVerificationModal);

export default withRouter(containerAddVerificationModal);
