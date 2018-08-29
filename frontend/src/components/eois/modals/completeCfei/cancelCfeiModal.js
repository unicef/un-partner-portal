import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { deleteCfeiRequest } from '../../../../reducers/deleteCfei';

const messages = {
  title: 'Are you sure you want to cancel this CFEI?',
  info: 'Please confirm that you want to cancel this CFEI?',
  confrim: 'confirm',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class CancelCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.confrim = this.confrim.bind(this);
  }

  confrim() {
    return this.props.deleteCfei().then(() => {
      history.push(this.props.previousPath);
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
              handleClick: this.confrim,
              label: messages.confrim,
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

CancelCfeiModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  deleteCfei: PropTypes.func,
  previousPath: PropTypes.string,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  showLoading: state.publishCfei.status.loading,
  previousPath: state.routesHistory.previousPath || ownProps.defaultPath,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteCfei: () => dispatch(deleteCfeiRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(CancelCfeiModal);

export default withStyles(styleSheet, { name: 'CancelCfeiModal' })(connected);
