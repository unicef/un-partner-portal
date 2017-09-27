import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui-icons/Close';
import FileUpload from 'material-ui-icons/FileUpload';
import Attachment from 'material-ui-icons/Attachment';

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
    fill: theme.palette.accent[300],
  },
});

class FileUploadButton extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleChange() {
    const { fileSelected, fileAdded } = this.props;
    const [file] = this.refInput.files;

    if (file) {
      fileSelected(file);
    } else if (!fileAdded) {
      fileSelected(null);
    }

    this.refInput.value = null;
  }

  handleRemove() {
    const { fileSelected } = this.props;

    fileSelected(null);
  }

  render() {
    const { classes, fieldName, deleteDisabled, fileAdded } = this.props;

    return (
      <div>
        <input
          onChange={this.handleChange}
          className={classes.root}
          name={`${fieldName}-input`}
          id={`${fieldName}-input`}
          ref={(field) => { this.refInput = field; }}
          type="file"
        />

        {!fileAdded ?
          <Button dense color="accent" >
            <label className={classes.iconLabel} htmlFor={`${fieldName}-input`}>
              <FileUpload className={classes.icon} />
              {messages.upload}
            </label>
          </Button>
          :
          <div className={classes.wrapContent}>
            <Typography type="subheading" className={classes.iconLabel} spacingBottom >
              <Attachment className={classes.icon} />
              {fileAdded}
              {!deleteDisabled && <IconButton onClick={() => this.handleRemove()}>
                <Close className={classes.removeIcon} />
              </IconButton>}
            </Typography>
          </div>}
      </div>
    );
  }
}

FileUploadButton.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  fileSelected: PropTypes.func.isRequired,
  fileAdded: PropTypes.object,
  deleteDisabled: PropTypes.bool,
};

FileUploadButton.defaultProps = {
  deleteDisabled: false,
};

export default withStyles(styleSheet, { name: 'FileUploadButton' })(FileUploadButton);

