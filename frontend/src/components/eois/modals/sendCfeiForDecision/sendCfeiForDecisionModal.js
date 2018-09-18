import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { sendCfeiForDecision } from '../../../../reducers/sendCfeiForDecision';

const messages = {
  title: 'Are you sure you want to send recommendation(s) to the focal point?',
  info: 'Please confirm that recommendation(s) should be sent to the focal point for review and issuance to the selected partner(s). ' +
      'Once sent to the focal point, you will no longer be able to make edits to this CFEI.',
  send: 'send',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class SendCfeiForDecisionModal extends Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
  }

  send() {
    return this.props.sendRecommendedPartner().then(() => {
      this.props.handleDialogClose();
    });
  }

  render() {
    const { dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          minwidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.send,
              label: messages.send,
            },
          }}
          content={
            <PaddedContent>
              <Typography type="body1">{messages.info}</Typography>
            </PaddedContent>
          }
        />
      </div >
    );
  }
}

SendCfeiForDecisionModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  sendRecommendedPartner: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.sendCfei.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  sendRecommendedPartner: () => dispatch(sendCfeiForDecision(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SendCfeiForDecisionModal);

export default withStyles(styleSheet, { name: 'SendCfeiForDecisionModal' })(connected);
