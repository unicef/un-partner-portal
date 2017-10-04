import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import FileDownload from 'material-ui-icons/FileDownload';

const messages = {
  download: 'download',
};

const styleSheet = theme => ({
  wrapContentButton: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
  },
  downloadIcon: {
    fill: theme.palette.secondary[700],
    marginRight: 5,
  },
});

const FileDownloadButton = (props) => {
  const { classes, fileUrl } = props;

  return (
    <div
      role="button"
      className={classes.wrapContentButton}
      onClick={() => { window.open(fileUrl); }}
    >
      <FileDownload className={classes.downloadIcon} />
      <Typography
        color="accent"
        type="button"
      >
        {messages.download}
      </Typography>
    </div>
  );
};

FileDownloadButton.propTypes = {
  classes: PropTypes.object.isRequired,
  fileUrl: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'FileDownloadButton' })(FileDownloadButton);
