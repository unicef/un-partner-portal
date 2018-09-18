import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import Save from 'material-ui-icons/Save';
import PaginatedList from '../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../common/hoc/tableWithStateInUrl';
import { isQueryChanged } from '../../../../helpers/apiHelper';
import {
  selectClarificationRequests,
  selectClarificationRequestsCount,
} from '../../../../store';
import { loadClarificationRequests } from '../../../../reducers/clarificationRequests';
import IconWithTextButton from '../../../common/iconWithTextButtonWrapped';
import { formatDateForPrint } from '../../../../helpers/dates';

const columns = [
  { name: 'partner', title: 'Organization name' },
  { name: 'created_by', title: 'Submitter' },
  { name: 'created', title: 'Date Submitted' },
  { name: 'question', title: 'Request', width: 500 },
];

const messages = {
  download: 'Download as PDF',
};

/* eslint-enable react/prop-types */
class OpenCfeiRequests extends Component {
  constructor() {
    super();
    this.applicationsCells = this.applicationsCells.bind(this);
  }

  componentWillMount() {
    const { id, query } = this.props;
    this.props.loadRequests(id, query);
  }

  shouldComponentUpdate(nextProps) {
    const { id, query } = this.props;
    if (isQueryChanged(nextProps, query)) {
      this.props.loadRequests(id, nextProps.location.query);
      return false;
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  applicationsCells({ row, column, value }) {
    if (column.name === 'created') {
      return <TableCell>{formatDateForPrint(value)}</TableCell>;
    } else if (column.name === 'partner') {
      return <TableCell>{value.legal_name}</TableCell>;
    } else if (column.name === 'created_by') {
      return <TableCell>{value.name}</TableCell>;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { requests, loading, itemsCount, id } = this.props;

    return (
      <div>
        <TableWithStateInUrl
          component={PaginatedList}
          items={requests}
          columns={columns}
          loading={loading}
          itemsCount={itemsCount}
          templateCell={this.applicationsCells}
          headerAction={
            <IconWithTextButton
              color={'accent'}
              icon={<Save />}
              text={messages.download}
              onClick={() => { window.open(`/api/projects/${id}/questions?export=pdf`, '_self'); }}
            />}
        />
      </div>
    );
  }
}

OpenCfeiRequests.propTypes = {
  requests: PropTypes.array.isRequired,
  loadRequests: PropTypes.func,
  loading: PropTypes.bool,
  query: PropTypes.object,
  itemsCount: PropTypes.number,
  id: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  requests: selectClarificationRequests(state, ownProps.params.id),
  itemsCount: selectClarificationRequestsCount(state, ownProps.params.id),
  loading: state.partnersApplicationsList.status.loading,
  query: ownProps.location.query,
  id: ownProps.params.id,
});

const mapDispatchToProps = dispatch => ({
  loadRequests: (id, params) => dispatch(loadClarificationRequests(id, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenCfeiRequests);
