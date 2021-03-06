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
  title: 'Number of New Calls for Expressions of Interest',
  button: 'view all',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    height: '100%',
  },
});


const NumberOfNewCfeis = (props) => {
  const { number, classes } = props;
  return (
    <Paper className={classes.paper}>
      <PaddedContent>
        <GridRow>
          <Typography type="headline">{messages.title}</Typography>
          <GridColumn alignItems="flex-end">
            {typeof number !== 'undefined' && (
              <Typography className={classes.number} type="display2">{number}</Typography>
            )}
            <Button component={Link} to="/cfei/open/" color="accent">{messages.button}</Button>
          </GridColumn>
        </GridRow>
      </PaddedContent>
    </Paper>
  );
};

NumberOfNewCfeis.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfNewCfeis;' })(NumberOfNewCfeis);
