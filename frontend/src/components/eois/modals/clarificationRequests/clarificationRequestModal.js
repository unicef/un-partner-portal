import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ControlledModal from '../../../common/modals/controlledModal';
import { loadClarificationRequests } from '../../../../reducers/clarificationRequests';
import ClarificationRequests from '../../details/overview/clarifications/clarificationRequests';
import { selectClarificationRequestsCount } from '../../../../store';

const messages = {
  title: 'Requests for an additional information/clarification',
  info: (_, count) => `This CFEI has ${count} request(s)`,
  ok: 'ok',
};

/* eslint-disable react/prefer-stateless-function */
class ClarificationRequestModal extends Component {
  render() {
    const { dialogOpen, handleDialogClose, count } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.info`${count || 0}` }}
          buttons={{
            raised: {
              handleClick: handleDialogClose,
              label: messages.ok,
            },
          }}
          content={<ClarificationRequests />}
        />
      </div >
    );
  }
}

ClarificationRequestModal.propTypes = {
  dialogOpen: PropTypes.bool,
  count: PropTypes.number,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  count: selectClarificationRequestsCount(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRequests: params => dispatch(loadClarificationRequests(ownProps.params.id, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClarificationRequestModal);
