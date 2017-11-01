import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import EmptyContent from '../../common/emptyContent';

const messages = {
  title: 'Number Of New CFEIs by Sector',
  caption: 'from past 10 days',
  button: 'view all',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
});


const NewPartners = (props) => {
  const { number, classes } = props;
  return (
    <Paper>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <Typography type="caption">{messages.caption}</Typography>
          <Divider />
          <EmptyContent />
          <Grid container justify="flex-end">
            <Grid item>
              <Button component={Link} to="/cfei/open/" color="accent">{messages.button}</Button>
            </Grid>
          </Grid>
        </GridColumn>
      </PaddedContent>
    </Paper>
  );
};

NewPartners.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NewPartners;' })(NewPartners);
