import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import PartnerEoiTable from './partnerEoiTable';
import PinIcon from '../common/pinIcon';
import TableFilter from '../common/tableFilter';
import TooltipIcon from '../common/tooltipIcon';


const messages = {
  title: 'List of Calls for Expressions of Interest',
  tooltip: 'Pin CFEI',
};

const createData = data => data.map((item, index) => ({ id: index, ...item }));


const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '01 Jan 2016', startDate: '30 Sep 2017', status: 0, pinned: true },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '04 Mar 2017', startDate: '30 Sep 2017', status: 0, pinned: false },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 1994', startDate: '30 Sep 2017', status: 2, pinned: true },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 2018', startDate: '30 Sep 2017', status: 1, pinned: true },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '29 Jun 2017', startDate: '30 Sep 2017', status: 2, pinned: false },
];

const renderPinIcon = (item, classes) => (
  <TooltipIcon
    Icon={PinIcon}
    displayTooltip={!item.pinned}
    infoText={messages.tooltip}
    iconClass={item.pinned ? classes.pinnedIcon : ''}
  />
);

const Overview = () => (
  <Grid container direction="column">

    <TableFilter />
    <PartnerEoiTable
      data={createData(mockData)}
      title={messages.title}
      renderItemIcon={renderPinIcon}
    />
    </Grid>
);

Overview.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Overview;
