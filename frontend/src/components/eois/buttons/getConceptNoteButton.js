import React from 'react';
import PropTypes from 'prop-types';
import Download from 'material-ui-icons/FileDownload';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Download Concept Note',
};

const downloadConceptNoteApplication = (conceptNote) => {
  window.open(conceptNote);
};

const GetConceptNoteButton = (props) => {
  const { id, conceptNote, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Download />}
      name="download"
      text={messages.text}
      onClick={() => downloadConceptNoteApplication(conceptNote)}
      {...other}
    />
  );
};

GetConceptNoteButton.propTypes = {
  id: PropTypes.string,
  conceptNote: PropTypes.string,
};

export default GetConceptNoteButton;
