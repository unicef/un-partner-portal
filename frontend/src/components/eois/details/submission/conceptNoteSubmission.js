import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { formatDateForPrint } from '../../../../helpers/dates';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import OrganizationProfileContent from './modal/organizationProfileContent';
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

const messages = {
  confirm: 'I confirm that my profile is up to date',
  lastUpdate: 'Last profile update:',
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
    captionStyle: {
      color: theme.palette.primary[500],
    },
    labelUnderline: {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: theme.palette.primary[500],
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
      openDialog: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    const { classes, submitDate, deadlineDate, loader, errorUpload,
      cnUploaded, handleSubmit, cn } = this.props;
    console.log(errorUpload)
    const { alert, errorMsg, checked } = this.state;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <PaddedContent>
          <CnFileSection
            component={<FileForm
              fieldName="cn"
              deleteDisabled={cnUploaded}
            />}
            displayHint={cn}
          />
          <Typography className={classes.alignRight} type="caption">
            {`${messages.deadline} ${formatDateForPrint(deadlineDate)}`}
          </Typography>
          <ProfileConfirmation onChange={(event, check) => this.handleCheck(event, check)} />
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
        </PaddedContent>
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
  cnUploaded: PropTypes.object,
  deadlineDate: PropTypes.string,
  submitDate: PropTypes.string,
  handleSubmit: PropTypes.func,
  cn: PropTypes.number,
};

const formConceptNoteSubmission = reduxForm({
  form: 'CNSubmission',
})(ConceptNoteSubmission);
const selector = formValueSelector('CNSubmission');

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.params.id);
  const application = selectPartnerApplicationDetails(state, ownProps.params.id);
  const { cn, created } = application;
  let props = {
    loader: state.conceptNote.loading,
    cnUploaded: state.conceptNote.cnFile,
    errorUpload: state.conceptNote.error,
    deadlineDate: cfei ? cfei.deadline_date : {},
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

const connectedConceptNoteSubmission = connect(mapStateToProps, mapDispatch)(formConceptNoteSubmission);
const withRouterConceptNoteSubmission = withRouter(connectedConceptNoteSubmission);

export default withStyles(styleSheet, { name: 'ConceptNoteSubmission' })(withRouterConceptNoteSubmission);

