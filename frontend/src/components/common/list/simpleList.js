import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import ListLoader from './listLoader';
import { calculatePaginatedPage, updatePageNumberSize, updatePageNumber } from '../../../helpers/apiHelper';

const SimpleList = (props) => {
  const { items, columns, templateCell, loading } = props;

  return (
    <ListLoader
      loading={loading}
    >
      <Grid
        rows={items}
        columns={columns}
      >

        <TableView
          tableCellTemplate={templateCell}
        />
        <TableHeaderRow />

      </Grid>
    </ListLoader>
  );
};


SimpleList.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};


export default SimpleList;
