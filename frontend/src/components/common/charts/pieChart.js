import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';

import Typography from 'material-ui/Typography';


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

const CustomPieChart = (props) => {
  const { label, colors, data, containerProps, defaultPieProps, pieProps } = props;
  return (
    <ResponsiveContainer {...containerProps}>
      <PieChart>
        <Pie
          data={data}
          {...defaultPieProps}
          {...pieProps}
        >
          <Label value={label} content={renderLabel} position="center" />
          {
            data.map(({ name }, index) => <Cell key={name} fill={colors[index % colors.length]} />)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>

  );
};

CustomPieChart.propTypes = {
  label: PropTypes.string,
  colors: PropTypes.array,
  data: PropTypes.array,
  containerProps: PropTypes.object,
  pieProps: PropTypes.object,
  defaultPieProps: PropTypes.object,
};

CustomPieChart.defaultProps = {
  containerProps: {
    width: '100%',
    height: 200,
  },
  defaultPieProps: {
    outerRadius: 100,
    innerRadius: '80%',
  },
};

export default CustomPieChart;
