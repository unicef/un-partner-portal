import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { formatDateForPrint } from '../../../../helpers/dates';
import Loader from '../../../common/loader';
import PaddedContent from '../../../common/paddedContent';
import FileUploadButton from '../../../common/buttons/fileUploadButton';
import ControlledModal from '../../../common/modals/controlledModal';
import OrganizationProfileContent from './modal/organizationProfileContent';
import { uploadPartnerConceptNote, uploadCnclearError } from '../../../../reducers/conceptNote';

const messages = {
  upload_1: 'Please make sure to use the Concept Note template provided by the UN Agency that published this CFEI.',
  upload_2: 'You will be at risk of disqualification if the proper Concept Note formatting is not used',
  confirm: 'I confirm that my profile is up to date',
  lastUpdate: 'Last profile update:',
  update: '12 Sep 2017',
  notSure: 'Not sure?',
  viewProifle: 'View your profile.',
  deadline: 'Application deadline: ',
  submit: 'submit',
  submitted: 'Submitted: ',
  close: 'close',
  dot: '.',
  editProfile: 'edit profile',
  countryProfile: 'Country Profile',
  fileError: 'Please upload your concept note before submission.',
  confirmError: 'Please confirm that your profile is up to date before submission.',
};

const styleSheet = createStyleSheet('HqProfile', (theme) => {
  const paddingNormal = theme.spacing.unit;
  const paddingSmall = theme.spacing.unit * 2;
  const padding = theme.spacing.unit * 3;

  return {
    icon: {
      marginRight: theme.spacing.unit,
    },
    checkboxContainer: {
      padding: `${paddingSmall}px ${paddingNormal}px ${padding}px ${paddingNormal}px`,
    },
    paddingTop: {
      padding: '12px 0px 0px 0px',
    },
    paddingBottom: {
      padding: `0px 0px ${paddingNormal}px 0px`,
    },
    alignRight: {
      margin: `${paddingNormal}px ${padding}px 0px 0px`,
      justifyContent: 'flex-end',
      alignItems: 'right',
      display: 'flex',
    },
    alignVertical: {
      display: 'flex',
      alignItems: 'top',
    },
    alignCenter: {
      margin: `${padding}px ${padding}px 0px ${padding}px`,
      padding: `${padding}px ${padding}px ${padding}px ${padding}px`,
      textAlign: 'center',
      background: theme.palette.primary[300],
    },
    captionStyle: {
      color: theme.palette.primary[500],
    },
    labelUnderline: {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: theme.palette.primary[500],
    },
    checked: {
      color: theme.palette.accent[500],
    },
    disabled: {
      color: theme.palette.accent[200],
    },
  };
});

class ConceptNoteSubmission extends Component {
  constructor(props) {
    super(props);

    this.state = { fileSelected: null, confirm: false, errorMsg: null, alert: false, openDialog: false };
    this.fileSelect = this.fileSelect.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);
    this.onDialogEdit = this.onDialogEdit.bind(this);
  }

  onDialogClose() {
    this.setState({ openDialog: false });
  }

  onDialogEdit() {
    const { partnerId } = this.props;

    history.push(`/profile/${partnerId}/edit`);
  }

  onDialogOpen() {
    this.setState({ openDialog: true });
  }

  handleCheck(event, checked) {
    this.setState({ confirm: checked });
  }

  fileSelect(file) {
    this.setState({ fileSelected: file });
  }

  upload() {
    const { classes } = this.props;
    return (
      <PaddedContent>
        <Typography className={classes.paddingBottom} type="caption">
          {messages.upload_1}
        </Typography>
        <Typography type="caption">{messages.upload_2}</Typography>
      </PaddedContent>);
  }

  handleDialogClose() {
    this.props.uploadCnclearError();
    this.setState({ alert: false });
  }

  handleSubmit() {
    const { confirm, fileSelected } = this.state;

    if (!fileSelected) {
      this.setState({ errorMsg: messages.fileError });
      this.setState({ alert: true });
    } else if (!confirm) {
      this.setState({ errorMsg: messages.confirmError });
      this.setState({ alert: true });
    }

    if (fileSelected && confirm) {
      this.props.uploadConceptNote(this.state.fileSelected);
    }
  }

  render() {
    const { classes, loader, errorUpload, cnUploaded } = this.props;
    const { alert, openDialog, fileSelected, errorMsg } = this.state;
    return (
      <div >
        <div className={classes.alignCenter}>
          <div>
            <FileUploadButton fieldName={'concept-note'} fileSelected={file => this.fileSelect(file)} deleteDisabled={cnUploaded} />
          </div>
          {fileSelected ? null : this.upload()}
        </div>

        <Typography className={classes.alignRight} type="caption">
          {`${messages.deadline} ${messages.update}`}
        </Typography>
        <div className={classes.checkboxContainer}>
          <div className={classes.alignVertical}>
            <Checkbox
              classes={{
                checked: classes.checked,
                disabled: classes.disabled,
              }}
              disabled={cnUploaded}
              checked={this.state.confirm}
              onChange={(event, checked) => this.handleCheck(event, checked)}
            />
            <div className={classes.paddingTop}>
              <Typography type="body1">{messages.confirm}</Typography>
              <div className={classes.alignVertical}>
                <Typography className={classes.captionStyle} type="body1">
                  {`${messages.lastUpdate} ${messages.update}${messages.dot} ${messages.notSure}`}
                </Typography>
                <Typography
                  onClick={() => this.onDialogOpen()}
                  className={classes.labelUnderline}
                  type="body1"
                >
                  {messages.viewProifle}
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.alignRight}>
            {cnUploaded
              ? <Typography type="body1">
                {`${messages.submitted} ${formatDateForPrint(cnUploaded.response.created)}`}
              </Typography>
              : <Button onClick={() => this.handleSubmit()} color="accent">
                {messages.submit}
              </Button>}
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={alert}
          message={errorMsg}
          autoHideDuration={6e3}
          onRequestClose={this.handleDialogClose}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!R.isEmpty(errorUpload)}
          message={errorUpload ? errorUpload.message || '' : ''}
          autoHideDuration={6e3}
          onRequestClose={this.handleDialogClose}
        />
        <ControlledModal
          maxWidth="md"
          title={messages.countryProfile}
          trigger={openDialog}
          buttons={{
            flat: {
              handleClick: this.onDialogClose,
              label: messages.close,
            },
            raised: {
              handleClick: this.onDialogEdit,
              label: messages.editProfile,
            },
          }}
          removeContentPadding
          content={<OrganizationProfileContent />}
        />
        <Loader loading={loader} fullscreen />
      </div>
    );
  }
}

ConceptNoteSubmission.propTypes = {
  classes: PropTypes.object.isRequired,
  partnerId: PropTypes.string,
  uploadConceptNote: PropTypes.func.isRequired,
  uploadCnclearError: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  errorUpload: PropTypes.object,
  cnUploaded: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  loader: state.conceptNote.loading,
  cnUploaded: state.conceptNote.response,
  errorUpload: state.conceptNote.error,
});

const mapDispatch = (dispatch, ownProps) => {
  const { id } = ownProps.params;

  return {
    uploadConceptNote: file => dispatch(uploadPartnerConceptNote(id, file)),
    uploadCnclearError: () => dispatch(uploadCnclearError()),
  };
};

const connectedConceptNoteSubmission = connect(mapStateToProps, mapDispatch)(ConceptNoteSubmission);
const withRouterConceptNoteSubmission = withRouter(connectedConceptNoteSubmission);

export default withStyles(styleSheet)(withRouterConceptNoteSubmission);

