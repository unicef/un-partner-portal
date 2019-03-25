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
import CaptionTypography from '../../common/typography/captionTypography';

const messages = {
  title: 'Number Of Pinned Calls for Expressions of Interest',
  caption: 'with application deadlines in the next 10 days',
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


const NumberOfPinnedCfeis = (props) => {
  const { number, classes } = props;

  return (
    <Paper className={classes.paper}>
      <PaddedContent>
        <GridRow>
          <div>
            <Typography type="headline">{messages.title}</Typography>
            <CaptionTypography>{messages.caption}</CaptionTypography>
          </div>
          <GridColumn alignItems="flex-end">
            {typeof number === 'number' && (
              <Typography className={classes.number} type="display2">{number}</Typography>
            )}
            <Button component={Link} to="/cfei/pinned/" color="accent">{messages.button}</Button>
          </GridColumn>
        </GridRow>
      </PaddedContent>
    </Paper>
  );
};

NumberOfPinnedCfeis.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfPinnedCfeis;' })(NumberOfPinnedCfeis);
