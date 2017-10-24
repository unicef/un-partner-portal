import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import ControlledModal from '../../../common/modals/controlledModal';
import SpreadContent from '../../../common/spreadContent';
import HeaderList from '../../../common/list/headerList';
import ConceptNoteSubmission from './conceptNoteSubmission';
import { deleteCn } from '../../../../reducers/conceptNote';

const messages = {
  title: 'Concept Note',
  confirm: 'Yes, DELETE',
  cancel: 'Cancel',
  confirmQuestion: 'Are you sure you want to delete this Concept Note',
  confirmMeesage: 'Your Concept Note will be removed from consideration upon deletion.' +
  'You can still resubmit a new Concept Note before deadline if you choose to.',
};

class CfeiSubmission extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
    this.onDelete = this.onDelete.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.handleDeleteAccept = this.handleDeleteAccept.bind(this);
  }

  onDelete() {
    this.setState({ open: true });
  }

  onDialogClose() {
    this.setState({ open: false });
  }

  handleDeleteAccept() {
    this.setState({ open: false });
    this.props.deleteCn();
  }

  titleHeader(cnUploaded) {
    return (
      <SpreadContent>
        <Typography type="headline">{messages.title}</Typography>
        {cnUploaded && <IconButton onClick={() => this.onDelete()}><Delete /></IconButton>}
      </SpreadContent>
    );
  }

  render() {
    const { open } = this.state;
    const { partnerId, cnUploaded } = this.props;

    return (
      <div>
        <HeaderList
          header={this.titleHeader(cnUploaded)}
          rows={[<ConceptNoteSubmission />]}
        />
        <ControlledModal
          maxWidth="md"
          title={messages.confirmQuestion}
          trigger={open}
          handleDialogClose={this.onDialogClose}
          buttons={{
            flat: {
              handleClick: this.onDialogClose,
              label: messages.cancel,
            },
            raised: {
              handleClick: this.handleDeleteAccept,
              label: messages.confirm,
            },
          }}
          topBottomPadding
          content={messages.confirmMeesage}
        />
      </div>
    );
  }
}

CfeiSubmission.propTypes = {
  partnerId: PropTypes.string,
  cnUploaded: PropTypes.object,
  deleteCn: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  loader: state.conceptNote.loading,
  cnUploaded: state.conceptNote.cnFile,
});

const mapDispatch = dispatch => ({
  deleteCn: () => dispatch(deleteCn()),
});

const connectedCfeiSubmission = connect(mapStateToProps, mapDispatch)(CfeiSubmission);
export default withRouter(connectedCfeiSubmission);

