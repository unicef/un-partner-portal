import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import { formatDateForPrint } from '../../../../helpers/dates';
import MainContentWrapper from '../../../../components/common/mainContentWrapper';
import HeaderNavigation from '../../../../components/common/headerNavigation';
import PaginatedList from '../../../../components/common/list/paginatedList';
import TableWithStateInUrl from '../../../../components/common/hoc/tableWithStateInUrl';
import { isQueryChanged } from '../../../../helpers/apiHelper';
import VerificationIcon from '../../profile/icons/verificationIcon';
import { loadVerificationsList } from '../../../../reducers/partnerVerificationsList';
import PartnerVerificationExpanded from './partnerVerificationExpanded';

const textStyles = {
  position: 'inline',
  display: 'flex',
  alignItems: 'center',
};

const tableCells = ({ row, column, hovered, value }) => {
  if (column.name === 'is_verified') {
    return (<TableCell>
      <div style={textStyles}>
        <VerificationIcon small verified={row.is_verified} />
        {row.is_verified
          ? 'Verified'
          : 'Unverified'}
      </div>
    </TableCell>);
  } else if (column.name === 'name') {
    return <TableCell>{row.submitter.name}</TableCell>;
  } else if (column.name === 'created') {
    return (<TableCell>
      {formatDateForPrint(row.created)}
    </TableCell>);
  }

  return <TableCell>{value}</TableCell>;
};

class PartnerVerificationsList extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.getVerifications(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.getVerifications(nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { columns, verifications, totalCount, loading } = this.props;

    return (
      <React.Fragment>
        <MainContentWrapper>
          <Grid container direction="column" spacing={24}>
            <Grid item>
              <TableWithStateInUrl
                component={PaginatedList}
                items={verifications}
                columns={columns}
                itemsCount={totalCount}
                loading={loading}
                expandable
                templateCell={tableCells}
                expandedCell={row =>
                  (<PartnerVerificationExpanded
                    initialValues={row}
                    form={`verificationDetailsExpanded_${row.id}`}
                    readOnly
                  />)}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </React.Fragment>
    );
  }
}

PartnerVerificationsList.propTypes = {
  verifications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  getVerifications: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  verifications: state.partnerVerificationsList.items,
  totalCount: state.partnerVerificationsList.totalCount,
  columns: state.partnerVerificationsList.columns,
  loading: state.partnerVerificationsList.loading,
  query: ownProps.location.query,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getVerifications: params => dispatch(loadVerificationsList(ownProps.params.id, params)),
});

const connectedPartnerVerificationsList = connect(
  mapStateToProps,
  mapDispatchToProps)(PartnerVerificationsList);
export default withRouter(connectedPartnerVerificationsList);
