import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router';
import { Divider } from 'material-ui';
import { loadPartnerFlags } from '../../../../../reducers/agencyPartnerObservationsList';
import PaddedContent from '../../../../common/paddedContent';
import Pagination from '../../../../common/pagination';
import EmptyContent from '../../../../common/emptyContent';
import FlaggingStatus from '../../../profile/common/flaggingStatus';
import ObservationExpand from '../../overview/observations/observationExpand';
import ObservationTypeIcon from '../../icons/observationTypeIcon';

const styleSheet = theme => ({
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

  background: {
    padding: `0px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    backgroundColor: theme.palette.common.lightGreyBackground,
  },
  backgroundTable: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    backgroundColor: '#FFFFFF',
  },
  marginIcon: {
    padding: `${theme.spacing.unit * 2}px 0px 0px ${theme.spacing.unit * 4}px`,
  },
});

const messages = {
  me: ' (me)',
  title: 'The box below contains the risk-related observations (if any) associated with the CSO/partner and captured in UN Partner Portal.',
  noInfo: 'No observations for CSO/partner.',
  hasFlags: 'This CSO/partner has: ',
};

class ObservationsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        page: 1,
        page_size: 1,
      },
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.partnerTitle = this.partnerTitle.bind(this);
  }

  componentWillMount() {
    this.props.getFlags(this.state.params);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!R.equals(nextState.params, this.state.params)) {
      this.props.getFlags(nextState.params);
      return false;
    }

    return true;
  }

  handleChangePage(event, page) {
    this.setState({ params: { ...this.state.params, page } });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ params: { ...this.state.params, page_size: event.target.value } });
  }

  partnerTitle() {
    const {
      partner: {
        partnerStatus: { flagging_status: flags = {},
        } = {},
      } = {},
    } = this.props;

    return (
      <Grid container alignItems="center">
        <Grid item>
          <Typography type="body2">
            {messages.hasFlags}
          </Typography>
        </Grid>
        <Grid item>
          <FlaggingStatus flags={flags} />
        </Grid>
      </Grid>);
  }

  render() {
    const { classes, loading, observations, count, children } = this.props;
    const { params: { page, page_size } } = this.state;

    return (
      <div className={classes.background}>
        <div>
          <div>
            <Typography style={{ margin: 'auto 0' }} type="body2" >{messages.title}</Typography>
            {this.partnerTitle()}
          </div>

          <div className={classes.backgroundTable}>
            {R.isEmpty(observations) ? loading
              ? <EmptyContent />
              : <PaddedContent big><Typography>{messages.noInfo}</Typography></PaddedContent>
              : observations.map(observation =>
                (<div>
                  <div className={classes.marginIcon}>
                    <ObservationTypeIcon
                      flagType={observation.flag_type}
                      isValid={observation.isValid}
                      isEscalated={observation.isEscalated}
                      category={observation.category}
                    />
                  </div>
                  <ObservationExpand observation={observation} />
                  <Divider />
                </div>))}
            <Pagination
              count={count}
              rowsPerPageOptions={[1, 2, 5]}
              rowsPerPage={page_size}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </div>
          {children}
        </div>
      </div>
    );
  }
}

ObservationsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  observations: PropTypes.array,
  getFlags: PropTypes.func,
  count: PropTypes.number,
  partner: PropTypes.object,
  children: PropTypes.node,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.partnerObservationsList.loading,
  observations: state.partnerObservationsList.items,
  count: state.partnerObservationsList.totalCount,
  userId: state.session.userId,
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getFlags: params => dispatch(loadPartnerFlags(ownProps.params.id, { ...params })),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styleSheet, { name: 'PartnerObservationsList' }),
)(ObservationsTable);
