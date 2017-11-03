import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import GridRow from '../../common/grid/gridRow';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';

const messages = {
  title: 'Number Of Concept Notes to Score',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
});


const NumberOfConceptNotes = (props) => {
  const { number, classes } = props;
  return (
    <Paper>
      <PaddedContent>
        <GridRow>
          <Typography type="headline">{messages.title}</Typography>
          <GridColumn align="flex-end">
            <Typography className={classes.number} type="display2">{number}</Typography>
          </GridColumn>
        </GridRow>
      </PaddedContent>
    </Paper>
  );
};

NumberOfConceptNotes.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfConceptNotes;' })(NumberOfConceptNotes);
