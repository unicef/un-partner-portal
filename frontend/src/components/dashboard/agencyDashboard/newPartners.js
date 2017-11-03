import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { toPairs, isEmpty, map } from 'ramda';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import PaddedContent from '../../common/paddedContent';
import { formatDateForChart } from '../../../helpers/dates';

const messages = {
  title: 'Number Of New Partners',
  caption: 'from past 15 days',
  button: 'view all',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
});


const NewPartners = (props) => {
  const { number, classes, dayBreakdown = {} } = props;
  let data;
  if (!isEmpty(dayBreakdown)) {
    data = map(
      ([date, count]) => ({ date: formatDateForChart(date), count }),
      toPairs(dayBreakdown));
  }
  return (
    <Paper>
      <PaddedContent>
        <GridRow>
          <div>
            <Typography type="headline">{messages.title}</Typography>
            <Typography type="caption">{messages.caption}</Typography>
          </div>
          <Grid container justify="flex-end">
            <Grid item>
              <Typography className={classes.number} type="display2">{number}</Typography>
            </Grid>
          </Grid>
        </GridRow>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ left: 0, right: 16, top: 16 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2196f3" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <Grid container justify="flex-end">
          <Grid item>
            <Button component={Link} to="/partner/" color="accent">{messages.button}</Button>
          </Grid>
        </Grid>
      </PaddedContent>
    </Paper>
  );
};

NewPartners.propTypes = {
  number: PropTypes.number,
  classes: PropTypes.object,
  dayBreakdown: PropTypes.array,
};

export default withStyles(styleSheet, { name: 'NewPartners;' })(NewPartners);
