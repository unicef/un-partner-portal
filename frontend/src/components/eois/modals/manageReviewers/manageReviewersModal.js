import React, { Component } from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { loadCfei } from '../../../../reducers/cfeiDetails';
import { updateCfei } from '../../../../reducers/newCfei';
import ManageReviewersForm from './manageReviewers';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';

const messages = {
  title: 'Manage Reviewers',
  header: {
    title: 'Choose reviewers for this CFEI',
    body: 'Email will be sent to selected accounts',
  },
  save: 'send',
};


class ManageReviewersModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { updateCfeiRequest, handleDialogClose, loadCfeiDetails, loadApplication } = this.props;

    return updateCfeiRequest(values).then(() => {
      loadCfeiDetails();
      loadApplication();
      handleDialogClose();
    });
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          minwidth={40}
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={messages.header}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<ManageReviewersForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

ManageReviewersModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateCfeiRequest: PropTypes.func,
  loadCfeiDetails: PropTypes.func,
  loadApplication: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfeiRequest: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('manageReviewers')),
  loadCfeiDetails: () => dispatch(loadCfei(ownProps.id)),
  loadApplication: () => dispatch(
    loadApplications(ownProps.id, { ...ownProps.location.query,
      status: [APPLICATION_STATUSES.PRE, APPLICATION_STATUSES.REC].join(',') })),
});

const containerManageReviewersModal = connect(
  null,
  mapDispatchToProps,
)(ManageReviewersModal);


export default withRouter(containerManageReviewersModal);

