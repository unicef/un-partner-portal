import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import PartnerFilter from '../../../partners/partnerFilter';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import PaginatedList from '../../../common/list/paginatedList';
import GridColumn from '../../../common/grid/gridColumn';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('HeaderList', (theme) => {
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      paddingLeft: `${paddingMedium}px`,
    },
  };
});

const FirstCell = withStyles(styleSheet)((props) => {
  const { classes, row } = props;
  return (
    <PartnerProfileNameCell
      className={classes.container}
      verified={row.verified}
      yellowFlag={row.flagYellow}
      redFlag={row.flagRed}
      name={row.name}
    />
  )
});

const partnerCell = (row, column, style) => {
  if (column.name === 'name') {
    return (<FirstCell row={row} />);
  }
  return undefined;
};

class PartnersContainer extends Component {
  render() {
    const { applications, columns } = this.props;
    return (
      <div>
        <GridColumn gutter={24}>
          <PartnerFilter />
          <PaginatedList
            items={applications}
            columns={columns}
            templateCell={(row, column, style) => partnerCell(row, column, style)}
            onPageSizeChange={pageSize => console.log('Page size', pageSize)}
            onCurrentPageChange={page => console.log('Page number', page)}
          />
        </GridColumn>
      </div>
    );
  }
}

PartnersContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  applications: state.partnersApplicationsList.applications,
  columns: state.partnersApplicationsList.columns,
});


export default connect(mapStateToProps)(PartnersContainer);
