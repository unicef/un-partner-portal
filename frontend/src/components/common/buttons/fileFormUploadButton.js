import R from 'ramda';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Close from 'material-ui-icons/Close';
import FileUpload from 'material-ui-icons/FileUpload';
import Attachment from 'material-ui-icons/Attachment';
import { fileNameFromUrl } from '../../../helpers/formHelper';
import { uploadFile, uploadClearFile, uploadRemoveFile } from '../../../reducers/commonFileUpload';
import FieldLabelWithTooltip from '../fieldLabelWithTooltip';

const messages = {
  upload: 'upload file',
  fileSizeError: 'Max file size is 25 MB',
};

const styleSheet = theme => ({
  root: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  iconLabel: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 72,
    minHeight: 48,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.secondary[700],
    },
    '&:active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  wrapContent: {
    display: 'inline-block',
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
  removeIcon: {
    fill: theme.palette.secondary[300],
  },
  link: {
    cursor: 'pointer',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  form: {
    maxWidth: '100%',
  },
});

class FileFormUploadButton extends Component {
  constructor(props) {
    super(props);

    this.state = { fileSizeError: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillUnmount() {
    this.props.removeFile(this.props.fieldName);
  }

  isFileSizeCorrect() {
    const [file] = this.refInput.files;

    return file && file.size / 1024 <= 25 * 1024;
  }

  handleChange() {
    const { fileAdded, fieldName, input: { onChange } } = this.props;
    const [file] = this.refInput.files;

    this.setState({
      fileSizeError: !this.isFileSizeCorrect(),
    });

    if (this.isFileSizeCorrect()) {
      this.props.uploadFile(fieldName, file).then(id =>
        onChange(id));
    } else if (!fileAdded) {
      this.handleRemove();
    }

    this.refInput.value = null;
  }

  handleRemove() {
    const { clearFile, fieldName, input: { onChange } } = this.props;

    clearFile(fieldName);
    onChange(null);
  }

  render() {
    const {
      classes,
      meta: { touched, error, warning },
      fieldName,
      deleteDisabled,
      fileUrl,
      input,
      errorMsg,
      label,
      infoText,
      optional,
      loading } = this.props;
    const url = R.is(String, input.value) ? input.value : fileUrl;

    return (
      <FormControl className={classes.form}>
        {label && <FieldLabelWithTooltip
          infoText={infoText}
          tooltipIconProps={{
            name: input.name,
          }}
        >
          {label}
        </FieldLabelWithTooltip>}
        <Fragment>
          <input
            onChange={this.handleChange}
            className={classes.root}
            name={`${fieldName}-input`}
            id={`${fieldName}-input`}
            ref={(field) => { this.refInput = field; }}
            type="file"
          />
          {!url
            ? <React.Fragment>
              <Typography component={'label'} color="accent" type="button" className={classes.iconLabel} htmlFor={`${fieldName}-input`}>
                {loading
                  ? <CircularProgress
                    className={classes.icon}
                    color="accent"
                    size={20}
                  />
                  : <FileUpload className={classes.icon} />}
                {messages.upload}
              </Typography>
              {((touched && error) || warning || (optional && errorMsg))
                && <FormHelperText error>{(!this.state.fileSizeError && !errorMsg)
                  ? (error || warning) : (errorMsg || messages.fileSizeError)}</FormHelperText>}
            </React.Fragment>
            : <div className={classes.wrapContent}>
              <Typography type="subheading" className={classes.iconLabel} gutterBottom >
                <Attachment className={classes.icon} />
                <div
                  role="button"
                  tabIndex={0}
                  className={classes.link}
                  onClick={() => { window.open(url); }}
                >
                  {fileNameFromUrl(url)}
                </div>
                {!deleteDisabled && <IconButton onClick={() => this.handleRemove()}>
                  <Close className={classes.removeIcon} />
                </IconButton>}
              </Typography>
            </div>}
        </Fragment>
      </FormControl>
    );
  }
}

FileFormUploadButton.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  fileAdded: PropTypes.object,
  input: PropTypes.object,
  deleteDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  optional: PropTypes.bool,
  fileUrl: PropTypes.string,
  errorMsg: PropTypes.string,
  infoText: PropTypes.node,
  meta: PropTypes.object,
  uploadFile: PropTypes.func.isRequired,
  clearFile: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
};

FileFormUploadButton.defaultProps = {
  deleteDisabled: false,
};

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const files = state.commonFileUpload;

  return {
    loading: files[fieldName] ? files[fieldName].loading : false,
    fileUrl: files[fieldName] ? files[fieldName].fileUrl : null,
    errorMsg: files[fieldName] ? files[fieldName].error.message : null,
  };
};

const mapDispatch = dispatch => ({
  uploadFile: (fieldName, file) => dispatch(uploadFile(fieldName, file)),
  clearFile: fieldName => dispatch(uploadClearFile(fieldName)),
  removeFile: fieldName => dispatch(uploadRemoveFile(fieldName)),
  dispatch,
});

const connectedFileFormUploadButton = connect(mapStateToProps, mapDispatch)(FileFormUploadButton);

export default withStyles(styleSheet, { name: 'FileFormUploadButton' })(connectedFileFormUploadButton);

