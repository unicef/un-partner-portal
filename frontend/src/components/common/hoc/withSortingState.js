// eslint-disable-next-line
import React, { Component } from 'react';
import { browserHistory as withRouter } from 'react-router';
import { connect } from 'react-redux';
import { updateOrder } from '../../../helpers/apiHelper';

class WithSortingState extends Component {
  constructor(props) {
    super(props);
debugger;
    this.state = { };
    this.changeSorting = this.changeSorting.bind(this);
  }

  changeSorting(sorting) {
    const { pathName, query } = this.props;

    this.setState({
      sorting,
    });

    const direction = sorting[0].direction === 'desc' ? '-' : '';
    updateOrder(sorting[0].columnName, direction, pathName, query);
  }

  render() {
    const { component } = this.props;
    return (<component
      {...this.props}
      allowSorting
      sorting={this.state.sorting}
      changeSorting={this.changeSorting}
    />);
  }
}


const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size,
  pageNumber: ownProps.location.query.page,
});

export default connect(mapStateToProps, null)(WithSortingState);

