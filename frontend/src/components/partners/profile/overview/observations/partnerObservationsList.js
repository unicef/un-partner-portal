import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import { Typography } from 'material-ui/';
import { withStyles } from 'material-ui/styles';
import PaginatedList from '../../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../../common/hoc/tableWithStateInUrl';
import { formatDateForPrint } from '../../../../../helpers/dates';
import { loadPartnerFlags } from '../../../../../reducers/agencyPartnerObservationsList';
import { isQueryChanged } from '../../../../../helpers/apiHelper';
import CustomGridColumn from '../../../../common/grid/customGridColumn';
import ObservationTypeIcon from '../../icons/observationTypeIcon';
import ObservationExpand from './observationExpand';
import PartnerObservationsListFilter from './partnerObservationsListFilter';
import UpdateObservationButton from '../../modals/updateObservation/updateObservationButton';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../../helpers/permissions';
import UpdateEscalatedObservationButton from '../../modals/updateObservationEscalated/updateEscalatedObservationButton';
import { FLAGS } from '../../../../../helpers/constants';

const styleSheet = theme => ({
  Active: {
    color: theme.palette.userStatus.active,
  },
  Invited: {
    color: theme.palette.userStatus.invited,
  },
  Deactivated: {
    color: theme.palette.userStatus.deactivated,
  },
  options: {
    display: 'flex',
    float: 'right',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    height: 58,
  },
});

const messages = {
  me: ' (me)',
};

class PartnerObservationsList extends Component {
  constructor(props) {
    super(props);

    this.applicationCell = this.applicationCell.bind(this);
    this.actionFlagCell = this.actionFlagCell.bind(this);
  }
  componentWillMount() {
    const { query } = this.props;

    this.props.getFlags(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.getFlags(nextProps.location.query);
      return false;
    }

    return true;
  }

  actionFlagCell(hovered, id, submitter, flagType, isValid) {
    const { classes, userId, hasResolveEscalatePermission } = this.props;

    return (<TableCell>
      {submitter ? <Grid container direction="row" alignItems="center" >
        <Grid item sm={10} xs={12} >
          <div className={classes.center}>
            <Typography type="body1" color="inherit">
              <div className={classes.center}>
                <div>{submitter.name}</div>
                <div>{userId === submitter.id ? messages.me : null},</div>
                <div>{submitter.agency_name}</div>
              </div>
            </Typography>
          </div>
        </Grid>
        <Grid item sm={2} xs={12} >
          <div className={classes.options}>
            {(userId === submitter.id) && flagType === FLAGS.YELLOW && isValid && <UpdateObservationButton id={id} />}
          </div>
          <div className={classes.options}>
            {hovered && hasResolveEscalatePermission && flagType === FLAGS.ESCALATED && <UpdateEscalatedObservationButton id={id} />}
          </div>
        </Grid>
      </Grid>
        : null}
    </TableCell>);
  }

  /* eslint-disable class-methods-use-this */
  applicationCell({ row, column, value, hovered }) {
    if (column.name === 'submitter') {
      return this.actionFlagCell(hovered, row.id, row.submitter, row.flag_type, row.isValid);
    } else if (column.name === 'modified') {
      return (<TableCell>
        {formatDateForPrint(row.modified)}
      </TableCell>);
    } else if (column.name === 'flag_type') {
      return <TableCell>{ObservationTypeIcon(row.flag_type, row.isValid)}</TableCell>;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { applications, columns, totalCount, loading } = this.props;

    return (
      <CustomGridColumn>
        <PartnerObservationsListFilter />
        <TableWithStateInUrl
          component={PaginatedList}
          items={applications}
          columns={columns}
          itemsCount={totalCount}
          loading={loading}
          templateCell={this.applicationCell}
          expandable
          expandedCell={row => <ObservationExpand observation={row} />}
        />
      </CustomGridColumn>
    );
  }
}

PartnerObservationsList.propTypes = {
  classes: PropTypes.object.isRequired,
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  getFlags: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
  userId: PropTypes.number,
  hasResolveEscalatePermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnerObservationsList.items,
  totalCount: state.partnerObservationsList.totalCount,
  columns: state.partnerObservationsList.columns,
  loading: state.partnerObservationsList.loading,
  query: ownProps.location.query,
  partner: ownProps.params.id,
  userId: state.session.userId,
  hasResolveEscalatePermission:
    checkPermission(AGENCY_PERMISSIONS.RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES, state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getFlags: params => dispatch(loadPartnerFlags(ownProps.params.id, params)),
});

const connectedPartnerObservationsList =
  connect(mapStateToProps, mapDispatchToProps)(PartnerObservationsList);

const withRouterPartner = withRouter(connectedPartnerObservationsList);

export default withStyles(styleSheet, { name: 'PartnerObservationsList' })(withRouterPartner);
