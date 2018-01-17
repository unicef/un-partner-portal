import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import FileDownload from 'material-ui-icons/FileDownload';

const messages = {
  download: 'download',
  noFile: 'no file added',
};

const styleSheet = theme => ({
  wrapContentButton: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    textDecoration: 'none',
  },
  downloadIcon: {
    fill: theme.palette.secondary[700],
    marginRight: 5,
  },
});

const FileDownloadButton = (props) => {
  const { classes, fileUrl } = props;

  return (
    <a
      tabIndex={0}
      href={fileUrl}
      className={classes.wrapContentButton}
      download={messages.download}
    >
      {fileUrl && <FileDownload className={classes.downloadIcon} />}
      <Typography
        color="accent"
        type="button"
      >
        {fileUrl ? messages.download : messages.noFile}
      </Typography>
    </a>
  );
};

FileDownloadButton.propTypes = {
  classes: PropTypes.object.isRequired,
  fileUrl: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'FileDownloadButton' })(FileDownloadButton);
