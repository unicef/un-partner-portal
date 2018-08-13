import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { formatDateForPrint } from '../../../../helpers/dates';
import Loader from '../../../common/loader';
import {
  uploadPartnerConceptNote,
  uploadCnclearError,
  selectLocalCnFile,
} from '../../../../reducers/conceptNote';
import { selectCfeiDetails, selectPartnerApplicationDetails } from '../../../../store';
import CnFileSection from './cnFileSection';
import PaddedContent from '../../../common/paddedContent';
import FileForm from '../../../forms/fileForm';
import ProfileConfirmation from '../../../organizationProfile/common/profileConfirmation';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';

const messages = {
  confirm: 'I confirm that my profile is up to date',
  notSure: 'Not sure?',
  viewProfile: 'View your profile.',
  deadline: 'Application deadline: ',
  submit: 'submit',
  submitted: 'Submitted: ',
  close: 'close',
  editProfile: 'edit profile',
  countryProfile: 'Country Profile',
  fileError: 'Please upload your concept note before submission.',
  confirmError: 'Please confirm that your profile is up to date before submission.',
};

const styleSheet = (theme) => {
  const paddingNormal = theme.spacing.unit;
  return {
    alignRight: {
      margin: `${paddingNormal}px 0px 0px 0px`,
      justifyContent: 'flex-end',
      alignItems: 'right',
      display: 'flex',
    },
  };
};

class ConceptNoteSubmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      errorMsg: null,
      alert: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCheck(event, checked) {
    this.setState({ checked });
  }

  handleDialogClose() {
    this.props.uploadCnclearError();
    this.setState({ alert: false });
  }

  handleSubmit(values) {
    this.props.uploadConceptNote(values);
  }

  clearState() {
    this.setState({ checked: false });
  }

  render() {
    const { classes,
      submitDate,
      deadlineDate,
      loader,
      errorUpload,
      cnUploaded,
      handleSubmit,
      hasUploadCnPermission,
      cn } = this.props;
    const { alert, errorMsg, checked } = this.state;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <PaddedContent>
          <CnFileSection
            component={
              <FileForm
                fieldName="cn"
                optional
                deleteDisabled={cnUploaded}
              />}
            showComponent={hasUploadCnPermission || cnUploaded}
            displayHint={!!cn}
          />
          <Typography className={classes.alignRight} type="caption">
            {`${messages.deadline} ${formatDateForPrint(deadlineDate)}`}
          </Typography>
          {(hasUploadCnPermission || cnUploaded) && <React.Fragment>
            <ProfileConfirmation
              checked={cnUploaded || this.state.checked}
              disabled={cnUploaded}
              onChange={(event, check) => this.handleCheck(event, check)}
            />
            <div className={classes.alignRight}>
              {cnUploaded
                ? <Typography type="body1">
                  {`${messages.submitted} ${formatDateForPrint(submitDate)}`}
                </Typography>
                : <Button
                  onClick={handleSubmit(this.handleSubmit)}
                  color="accent"
                  disabled={!checked}
                >
                  {messages.submit}
                </Button>}
            </div>
          </React.Fragment>}
        </PaddedContent>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={alert}
          message={errorMsg}
          autoHideDuration={6e3}
          onClose={this.handleDialogClose}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!R.isEmpty(errorUpload)}
          message={errorUpload ? errorUpload.message || '' : ''}
          autoHideDuration={6e3}
          onClose={this.handleDialogClose}
        />
        <Loader loading={loader} fullscreen />
      </form >
    );
  }
}

ConceptNoteSubmission.propTypes = {
  classes: PropTypes.object.isRequired,
  uploadConceptNote: PropTypes.func.isRequired,
  uploadCnclearError: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  errorUpload: PropTypes.object,
  cnUploaded: PropTypes.bool,
  deadlineDate: PropTypes.string,
  submitDate: PropTypes.string,
  hasUploadCnPermission: PropTypes.bool,
  handleSubmit: PropTypes.func,
  cn: PropTypes.string,
  onRef: PropTypes.func,
};

const formConceptNoteSubmission = reduxForm({
  form: 'CNSubmission',
})(ConceptNoteSubmission);
const selector = formValueSelector('CNSubmission');

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.params.id);
  const application = selectPartnerApplicationDetails(state, ownProps.params.id);
  const hasUploadCnPermission = checkPermission(PARTNER_PERMISSIONS.CFEI_SUBMIT_CONCEPT_NOTE, state);
  const { cn, created } = application;
  let props = {
    hasUploadCnPermission,
    loader: state.conceptNote.loading,
    cnUploaded: !!state.conceptNote.cnFile,
    errorUpload: state.conceptNote.error,
    deadlineDate: cfei ? cfei.deadline_date : '',
    cn: selector(state, 'cn'),
  };
  if (cn) props = { ...props, initialValues: { cn }, submitDate: created };
  return props;
};

const mapDispatch = (dispatch, ownProps) => {
  const { id } = ownProps.params;

  return {
    uploadConceptNote: file => dispatch(uploadPartnerConceptNote(id, file)),
    uploadCnclearError: () => dispatch(uploadCnclearError()),
    uploadSelectedLocalFile: file => dispatch(selectLocalCnFile(file)),
  };
};

const connectedConceptNoteSubmission = connect(mapStateToProps,
  mapDispatch)(formConceptNoteSubmission);
const withRouterConceptNoteSubmission = withRouter(connectedConceptNoteSubmission);

export default withStyles(styleSheet, { name: 'ConceptNoteSubmission' })(withRouterConceptNoteSubmission);

