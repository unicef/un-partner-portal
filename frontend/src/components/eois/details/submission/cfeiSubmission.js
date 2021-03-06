import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../../common/modals/controlledModal';
import SpreadContent from '../../../common/spreadContent';
import HeaderList from '../../../common/list/headerList';
import ConceptNoteSubmission from './conceptNoteSubmission';
import { deleteUploadedCn } from '../../../../reducers/conceptNote';
import PaddedContent from '../../../common/paddedContent';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';
import { isCfeiDeadlinePassed } from '../../../../store';


const messages = {
  completeProfile: 'Complete Profile',
  incomplete: 'Your organization cannot submit an application for funding consideration until ' +
  'it has completed its profile in the UN Partner Portal.',
  hq: 'You cannot submit an application as HQ profile, please switch to country profile',
  title: 'Concept Note',
  confirm: 'Yes, DELETE',
  cancel: 'Cancel',
  confirmQuestion: 'Are you sure you want to delete this Concept Note?',
  confirmMeesage: 'Your Concept Note, once deleted, will be removed from funding consideration. A new Concept Note may be uploaded.',
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
    this.props.deleteCn(this.props.projectId, this.props.applicationId);
    this.conceptForm.clearState();
  }

  titleHeader() {
    const { cnUploaded, hasUploadCnPermission, isDeadlinePassed } = this.props;
    return (
      <SpreadContent>
        <Typography type="headline">{messages.title}</Typography>
        {(!!cnUploaded && hasUploadCnPermission && !isDeadlinePassed)
          && <IconButton onClick={() => this.onDelete()}><Delete /></IconButton>}
      </SpreadContent>
    );
  }

  render() {
    const { open } = this.state;
    const { partnerId, isHq, isProfileComplete } = this.props;
    if (isHq) {
      return (<Paper>
        <PaddedContent big >
          <Typography>{messages.hq}</Typography>
        </PaddedContent>
      </Paper>);
    } else if (!isProfileComplete) {
      return (<Paper>
        <PaddedContent big >
          <Typography>{messages.incomplete}</Typography>
          <Grid container justify="flex-end">
            <Grid item>
              {<Button
                component={Link}
                to={`/profile/${partnerId}/edit/`}
                color="accent"
              >
                {messages.completeProfile}
              </Button>}
            </Grid>
          </Grid>
        </PaddedContent>
      </Paper>);
    }
    return (
      <div>
        <HeaderList
          header={this.titleHeader()}
        >
          <ConceptNoteSubmission onRef={(ref) => { this.conceptForm = ref; }} />
        </HeaderList>
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
  partnerId: PropTypes.number,
  projectId: PropTypes.string,
  applicationId: PropTypes.number,
  cnUploaded: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  deleteCn: PropTypes.func.isRequired,
  isProfileComplete: PropTypes.bool,
  hasUploadCnPermission: PropTypes.bool,
  isHq: PropTypes.bool,
  isDeadlinePassed: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: state.session.partnerId,
  projectId: ownProps.params.id,
  isDeadlinePassed: isCfeiDeadlinePassed(state, ownProps.params.id),
  applicationId: state.partnerAppDetails[ownProps.params.id]
    ? state.partnerAppDetails[ownProps.params.id].id : null,
  loader: state.conceptNote.loading,
  cnUploaded: state.conceptNote.cnFile,
  isHq: state.session.isHq,
  isProfileComplete: state.session.isProfileComplete,
  hasUploadCnPermission: checkPermission(PARTNER_PERMISSIONS.CFEI_SUBMIT_CONCEPT_NOTE, state),
});

const mapDispatch = dispatch => ({
  deleteCn: (projectId, applicationId) => dispatch(deleteUploadedCn(projectId, applicationId)),
});

const connectedCfeiSubmission = connect(mapStateToProps, mapDispatch)(CfeiSubmission);
export default withRouter(connectedCfeiSubmission);

