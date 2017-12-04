import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { toPairs, isEmpty, map } from 'ramda';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import SpreadContent from '../../common/spreadContent';
import DonutChart from '../../common/charts/pieChart';
import CaptionTypography from '../../common/typography/captionTypography';
import { chartColors } from '../../../styles/muiTheme';

const messages = {
  title: 'Number Of Partners',
  caption: 'by type',
};

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
          <CaptionTypography>{messages.caption}</CaptionTypography>
          <DonutChart colors={chartColors} label={total} data={data} />
          {data.map(({ name, value }, index) => (
            <div key={`name_${index}`}>
              <GridColumn spacing={8}>
                <SpreadContent>
                  <Grid container alignItems="center">
                    <Grid item>
                      <div style={{ height: 24, width: 8, background: chartColors[index] }} />
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
