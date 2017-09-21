import React from 'react';
import PropTypes from 'prop-types';
import Download from 'material-ui-icons/FileDownload';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Download Concept Note',
};

const downloadConceptNoteApplication = (id) => {
  console.log(`Download: ${id}`);
};

const GetConceptNoteButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Download />}
      name="download"
      text={messages.text}
      onClick={() => downloadConceptNoteApplication(id)}
      {...other}
    />
  );
};

GetConceptNoteButton.propTypes = {
  id: PropTypes.string,
};

export default GetConceptNoteButton;
