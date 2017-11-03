import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { toPairs, isEmpty, map } from 'ramda';
import { Link } from 'react-router';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import VerticalBarChart from '../../common/charts/verticalBarChart';

const messages = {
  title: 'Number Of New CFEIs by Sector',
  caption: 'from past 10 days',
  button: 'view all',
  number: 'number',
};

const styleSheet = theme => ({
  number: {
    paddingRight: theme.spacing.unit * 2,
  },
});

const NumberOfCfeisBySector = (props) => {
  const { newCfeiBySectors = {} } = props;
  let data;
  if (!isEmpty(newCfeiBySectors)) {
    data = map(
      ([sector, count]) => ({ name: sector, count }),
      toPairs(newCfeiBySectors));
  }
  return (
    <Paper>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <Typography type="caption">{messages.caption}</Typography>
          <Divider />
          <VerticalBarChart
            data={data}
            containerProps={{ width: '100%', height: 500 }}
            barChartProps={{ margin: { left: 0, right: 16, top: 16 }, barCategoryGap: 8 }}
            barProps={{ fill: '#DCC0E4', barSize: 24 }}
          />
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

NumberOfCfeisBySector.propTypes = {
  newCfeiBySectors: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'NumberOfCfeisBySector;' })(NumberOfCfeisBySector);
