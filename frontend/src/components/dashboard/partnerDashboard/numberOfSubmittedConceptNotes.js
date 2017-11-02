import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../common/paddedContent';


const messages = {
  title: 'Number Of Submitted Concept Notes',
};


const NumberOfSubmittedConceptNotes = (props) => {
  const { } = props;
  return (
    <Paper>
      <PaddedContent>
        <Typography type="headline">{messages.title}</Typography>
      </PaddedContent>
    </Paper>
  );
};

NumberOfSubmittedConceptNotes.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default NumberOfSubmittedConceptNotes;
