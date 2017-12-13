import R from 'ramda';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormControl, FormHelperText, FormLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Close from 'material-ui-icons/Close';
import FileUpload from 'material-ui-icons/FileUpload';
import Attachment from 'material-ui-icons/Attachment';
import { fileNameFromUrl } from '../../../helpers/formHelper';
import { uploadFile, uploadClearFile, uploadRemoveFile } from '../../../reducers/commonFileUpload';

const messages = {
  upload: 'upload file',
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
});

class FileFormUploadButton extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillUnmount() {
    this.props.removeFile(this.props.fieldName);
  }

  handleChange() {
    const { fileAdded, fieldName, input: { onChange } } = this.props;
    const [file] = this.refInput.files;


    if (file) {
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
      label,
      loading } = this.props;
    const url = R.is(String, input.value) ? input.value : fileUrl;
    return (
      <FormControl fullWidth>
        {label && <FormLabel>{label}</FormLabel>}
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
            ? <div>
              <Button dense color="accent" >
                <label className={classes.iconLabel} htmlFor={`${fieldName}-input`}>
                  {loading
                    ? <CircularProgress
                      className={classes.icon}
                      color="accent"
                      size={20}
                    />
                    : <FileUpload className={classes.icon} />}
                  {messages.upload}
                </label>
              </Button>
              {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
            </div>
            : <div className={classes.wrapContent}>
              <Typography type="subheading" className={classes.iconLabel} spacingBottom >
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
  label: PropTypes.string.isRequired,
  fileAdded: PropTypes.object,
  input: PropTypes.object,
  deleteDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  fileUrl: PropTypes.string,
  warning: PropTypes.string,
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

