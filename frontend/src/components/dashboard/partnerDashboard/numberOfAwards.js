import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';

const messages = {
  title: 'Number Of Awards to Date',
  button: 'view all',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
});


const NumberOfAwards = (props) => {
  const { number, classes } = props;
  return (
    <Paper>
      <PaddedContent>
        <GridRow>
          <Typography type="headline">{messages.title}</Typography>
          <GridColumn align="flex-end">
            <Typography className={classes.number} type="display2">{number}</Typography>
            <Button
              component={Link}
              to="/applications/notes/"
              color="accent"
            >
              {messages.button}
            </Button>
          </GridColumn>
        </GridRow>
      </PaddedContent>
    </Paper>
  );
};

NumberOfAwards.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfAwards;' })(NumberOfAwards);
