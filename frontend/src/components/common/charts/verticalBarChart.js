import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const renderLabel = data => ({ index, x, y, width, height }) => (<text
  className="recharts-text recharts-label"
  y={y + (height * 0.75)}
  x={x + 8}
  height={height}
  width={width}
  textAnchor="start"
>
  <Typography type="caption" component="tspan" >{data[index].name}</Typography>
</text>);
const getPath = (x, y, width, height) => `M ${x},${y} h ${width} v ${height} h ${-width} Z`;

const renderBar = (props) => {
  const { fill, x, y, width, height } = props;
  return ([
    <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />,
    <line
      x1={x - 4}
      x2="100%"
      y1={y + height + 8}
      y2={y + height + 8}
      stroke="rgba(0, 0, 0, 0.12)"
    />,
  ]);
};


const VerticalBarChart = (props) => {
  const { data, containerProps, barChartProps, barProps } = props;
  return (
    <ResponsiveContainer {...containerProps}>
      <BarChart
        data={data}
        layout="vertical"
        {...barChartProps}
      >
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" hide />
        <Tooltip />
        <Bar
          dataKey="count"
          shape={renderBar}
          {...barProps}
          label={renderLabel(data)}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

VerticalBarChart.propTypes = {
  data: PropTypes.array,
  containerProps: PropTypes.object,
  barChartProps: PropTypes.object,
  barProps: PropTypes.object,
};

export default VerticalBarChart;
