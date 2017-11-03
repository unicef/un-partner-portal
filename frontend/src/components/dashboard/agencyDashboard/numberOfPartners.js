import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { toPairs, isEmpty, map } from 'ramda';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import SpreadContent from '../../common/spreadContent';
import DonutChart from '../../common/charts/pieChart';

const messages = {
  title: 'Number Of Partners',
  caption: 'by type',
};
const COLORS = ['#668DDB', '#F7C848', '#ADEAC0', '#A996D8', '#EE7635'];

const renderLabel = ({ value, offset, position, viewBox, ...params }) => (
  <text
    className="recharts-text recharts-label"
    textAnchor="middle"
    y={+viewBox.cy + 12}
    x={+viewBox.cx}
  >
    <Typography type="display2" component="tspan" >{value}</Typography>
  </text>
);

const NumberOfPartners = (props) => {
  const { partnerBreakdown = {}, orgTypes } = props;
  let data = [];
  let total = 0;
  if (!isEmpty(partnerBreakdown)) {
    data = map(
      ([orgType, value]) => ({ name: orgTypes[orgType], value }),
      toPairs(partnerBreakdown));
    total = data.reduce((count, next) => count + next.value, 0);
  }
  return (
    <Paper>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <Typography type="caption">{messages.caption}</Typography>
          <DonutChart colors={COLORS} label={total} data={data} />
          {data.map(({ name, value }, index) => (
            <div key={`name_${index}`}>
              <GridColumn spacing={8}>
                <SpreadContent>
                  <Grid container align="center">
                    <Grid item>
                      <div style={{ height: 24, width: 8, background: COLORS[index] }} />
                    </Grid>
                    <Grid item>
                      <Typography>{name}</Typography>
                    </Grid>
                  </Grid>
                  <Typography>{value}</Typography>
                </SpreadContent>
                <Divider />
              </GridColumn>
            </div>))}
        </GridColumn>
      </PaddedContent>
    </Paper>
  );
};

NumberOfPartners.propTypes = {
  partnerBreakdown: PropTypes.object,
  orgTypes: PropTypes.object,
};

const mapStateToProps = state => ({
  orgTypes: state.partnerProfileConfig['partner-type'],
});

export default connect(mapStateToProps)(NumberOfPartners);
