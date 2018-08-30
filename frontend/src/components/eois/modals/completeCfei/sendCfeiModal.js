import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { sendCfeiRequest } from '../../../../reducers/sendCfei';

const messages = {
  title: 'Are you sure you want to send this CFEI to the focal point?',
  info: 'An e-mail notification that this CFEI is now finalized will be sent to all partners who applied for this CFEI.',
  send: 'send',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class SendCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
  }

  send() {
    return this.props.sendCfei().then(() => {
      this.props.handleDialogClose();
    });
  }

  render() {
    const { classes, dialogOpen, handleDialogClose } = this.props;
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
              <Typography className={classes.text} >{messages.info}</Typography>
            </PaddedContent>
          }
        />
      </div >
    );
  }
}

SendCfeiModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  sendCfei: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.sendCfei.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  sendCfei: () => dispatch(sendCfeiRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SendCfeiModal);

export default withStyles(styleSheet, { name: 'SendCfeiModal' })(connected);
