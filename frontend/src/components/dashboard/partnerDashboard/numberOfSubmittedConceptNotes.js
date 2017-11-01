import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import EmptyContent from '../../common/emptyContent';

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
