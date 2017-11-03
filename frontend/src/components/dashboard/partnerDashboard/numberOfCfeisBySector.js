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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';

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

const renderLabel = data => ({ index, x, y, width, height }) => (<text
  className="recharts-text recharts-label"
  y={y + (height * 0.75)}
  x={x + 8}
  height={height}
  width={width}
  textAnchor="start"
>
  <Typography type="caption" component="tspan" >{data[index].sectorName}</Typography>
</text>);
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
          Z`;
};

const renderBar = (props) => {
  const { fill, x, y, width, height } = props;

  return (<path d={getPath(x, y, width, height)} stroke="none" fill={fill}/>)

};


const NumberOfCfeisBySector = (props) => {
  const { newCfeiBySectors = {} } = props;
  let data;
  if (!isEmpty(newCfeiBySectors)) {
    data = map(
      ([sector, count]) => ({ sectorName: sector, count }),
      toPairs(newCfeiBySectors));
  }
  return (
    <Paper>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <Typography type="caption">{messages.caption}</Typography>
          <Divider />
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{ left: 16, right: 16, top: 16 }}
              layout="vertical"
              barCategoryGap={8}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="sectorName" type="category" hide />
              <Tooltip />
              <Bar dataKey="count" shape={renderBar} fill="#DCC0E4" label={renderLabel(data)} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
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
