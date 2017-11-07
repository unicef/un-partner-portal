import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assoc } from 'ramda';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter, browserHistory as history } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateApplication } from '../../../../reducers/applicationDetails';
import AwardApplicationForm from './awardApplicationForm';

const messages = {
  title: 'Award Concept Note',
  header: 'Partner will be notified by e-mail. Provide justification for your decision',
  award: 'award',
};


class awardApplicationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  onFormSubmit(values) {
    this.props.updateApplication({ ...values, did_win: true });
    this.handleDialogClose();
  }

  handleDialogClose() {
    const loc = history.getCurrentLocation();
    this.props.handleDialogClose();
    history.push(assoc('hash', null, loc));
  }

  render() {
    const { submit, dialogOpen, router } = this.props;
    const hash = router.getCurrentLocation().hash;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen || hash === '#award-open'}
          handleDialogClose={this.handleDialogClose}
          info={{ title: messages.header }}
          buttons={{
            flat: {
              handleClick: this.handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.award,
            },
          }}
          content={<AwardApplicationForm onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

awardApplicationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  handleDialogClose: PropTypes.func,
  updateApplication: PropTypes.func,
  router: PropTypes.object,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { applicationId } } = ownProps;
  return {
    updateApplication: body => dispatch(updateApplication(
      applicationId, body)),
    submit: () => dispatch(submit('awardApplication')),
  };
};

const containerAwardApplicationModal = connect(
  null,
  mapDispatchToProps,
)(awardApplicationModal);

export default withRouter(containerAwardApplicationModal);
