import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableRow,

} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import EnhancedTableHead from '../common/table/enhancedTableHead';
import SharedTable from '../common/table/sharedTable';
import styleSheet from '../common/table/tableStyling';
import EoiSectorCell from './cells/eoiSectorCell';
import EoiStatusCell from './cells/eoiStatusCell';


class AgencyEoiTable extends SharedTable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      selectable: false,
    };
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, columnData } = this.state;

    return (
      <Paper >
        <Paper elevation={0} className={classes.paper}>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnData={columnData}
              firstCell={classes.firstCell}
            />
            <TableBody>
              {data.map(n => (
                <TableRow
                  hover
                  onMouseLeave={this.handleMouseLeave}
                  onMouseEnter={this.handleMouseEnter(n.id)}
                  tabIndex="-1"
                  key={n.id}
                >
                  <TableCell className={`${classes.limitedCell} ${classes.firstCell}`}>
                    {n.name}
                  </TableCell>
                  <TableCell >
                    {n.agency}
                  </TableCell>
                  <TableCell >
                    {n.country}
                  </TableCell>
                  <TableCell >
                    <EoiSectorCell data={n.sector} />
                  </TableCell>
                  <TableCell >
                    {n.datePosted}
                  </TableCell>
                  <TableCell >
                    {n.deadline}
                  </TableCell>
                  <TableCell>
                    <EoiStatusCell id={n.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
    );
  }
}

AgencyEoiTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
  renderCells: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(AgencyEoiTable);
