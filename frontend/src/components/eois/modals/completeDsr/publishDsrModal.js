import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { publishCfeiRequest } from '../../../../reducers/publishCfei';

const messages = {
  title: 'Are you sure you want to publish this Direct selection / retention?',
  info: 'Please confirm that this direct selection/retention should be published. An e-mail notification will be sent to the selected partner.',
  publish: 'publish',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class PublishDsrModal extends Component {
  constructor(props) {
    super(props);
    this.publish = this.publish.bind(this);
  }

  publish() {
    return this.props.publishDsr().then(() => {
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
          minWidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.publish,
              label: messages.publish,
            },
          }}
          content={
            <PaddedContent>
              <Typography className={classes.text}>{messages.info}</Typography>
            </PaddedContent>
          }
        />
      </div >
    );
  }
}

PublishDsrModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  publishDsr: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.publishCfei.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  publishDsr: () => dispatch(publishCfeiRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(PublishDsrModal);

export default withStyles(styleSheet, { name: 'PublishDsrModal' })(connected);
