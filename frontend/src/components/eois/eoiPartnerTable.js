import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import {
  TableCell,
} from 'material-ui/Table';

import RegularTable from '../common/table/regularTable';
import EoiSectorCell from './cells/eoiSectorCell';
import EoiCountryCell from './cells/eoiCountryCell';
import EoiFilter from './filters/eoiFilter';
import AlertDialog from '../common/alertDialog';

const messages = {
  title: 'List of Calls for Expressions of Interest',
};

export const columnData = [
  { id: 'title', label: 'Project name' },
  { id: 'country_code', label: 'Country' },
  { id: 'sector', label: 'Sector' },
  { id: 'agency', label: 'Agency' },
  { id: 'deadline_date', label: 'Application deadline' },
  { id: 'start_date', label: 'Project start date' },
];

export const renderCells = (item, classes) => [
  <TableCell className={`${classes.limitedCell} ${classes.firstCell}`}>
    {item.title}
  </TableCell>,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sectors} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.agency.name}
  </TableCell>,
  <TableCell >
    {item.deadline_date}
  </TableCell>,
  <TableCell >
    {item.start_date}
  </TableCell>,
];

class EoiPartnerTable extends Component {
  constructor(props) {
    super(props);
    this.state = { alert: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMsg) this.setState({ alert: true });
  }

  handleDialogClose() {
    this.setState({ alert: false });
  }

  render() {
    const { cfei, loading, errorMsg } = this.props;
    const { alert } = this.state;
    return (
      <Grid container direction="column" gutter={40}>
        <Grid item>
          <EoiFilter />
        </Grid>
        <Grid item>
          <RegularTable
            data={cfei}
            columnData={columnData}
            title={messages.title}
            renderTableCells={renderCells}
            loading={loading}
          />
        </Grid>
        <AlertDialog
          trigger={alert}
          title="Warning"
          text={errorMsg}
          handleDialogClose={() => this.setState({ alert: false })}
        />
      </Grid>
    );
  }
}

EoiPartnerTable.propTypes = {
  cfei: PropTypes.array,
  loading: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default EoiPartnerTable;
