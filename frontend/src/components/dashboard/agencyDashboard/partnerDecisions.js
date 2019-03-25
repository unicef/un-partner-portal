import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { loadApplicationDecisions } from '../../../reducers/applicationsDecisions';
import SpreadContent from '../../common/spreadContent';
import PaddedContent from '../../common/paddedContent';
import CustomGridColumn from '../../common/grid/customGridColumn';
import { formatDateForPrint } from '../../../helpers/dates';
import Pagination from '../../common/pagination';
import TextWithBackground from '../../common/textWithColorBackground';
import Loader from '../../common/loader';


const messages = {
  title: 'Partner Decisions From Past 5 Days',
  decisionDate: 'Decision date',
  accepted: 'accepted',
  declined: 'declined',
};

const styleSheet = () => ({
  name: { flexBasis: '40%' },
  status: { flexBasis: '40%' },
});

const SingleDecisionBase = ({
  classes,
  id,
  partner: { legal_name },
  eoi: { title },
  modified, did_accept,
}) => (
  <Paper>
    <PaddedContent>
      <SpreadContent>
        <div className={classes.name}>
          <Typography type="body2">
            {legal_name}
          </Typography>
          <Typography type="caption">
            {`${id} | ${title}`}
          </Typography>
        </div>
        <div className={classes.status}>
          <TextWithBackground
            text={did_accept ? messages.accepted : messages.declined}
            type="button"
            color={did_accept ? 'green' : 'red'}
          />
        </div>
        <div>
          <Typography type="caption">
            {`${messages.decisionDate}:`}
          </Typography>
          <Typography>
            {formatDateForPrint(modified)}
          </Typography>
        </div>
      </SpreadContent>
    </PaddedContent>
  </Paper>);

const SingleDecision = withStyles(styleSheet, { name: 'SingleDecision' })(SingleDecisionBase);

class PartnerDecisions extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        page: 1,
        page_size: 5,
      },
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentWillMount() {
    this.props.loadDecisions(this.state.params);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!R.equals(nextState.params, this.state.params)) {
      this.props.loadDecisions(nextState.params);
      return false;
    }
    if (R.isEmpty(nextProps.decisions)) return false;
    return true;
  }

  handleChangePage(event, page) {
    this.setState({ params: { ...this.state.params, page } });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ params: { ...this.state.params, page_size: event.target.value } });
  }

  render() {
    const { decisions, loading, count } = this.props;
    const { params: { page, page_size } } = this.state;
    return (
      <Loader loading={loading} >
        <CustomGridColumn>
          <Typography type="headline">{messages.title}</Typography>
          {decisions.map(decision => React.createElement(SingleDecision, {...decision, key: decision.id}))}
          <Grid container justify="center" >
            <Grid item>
              <Pagination
                count={count}
                rowsPerPage={page_size}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </CustomGridColumn>
      </Loader>

    );
  }
}

PartnerDecisions.propTypes = {
  loading: PropTypes.bool,
  decisions: PropTypes.array,
  loadDecisions: PropTypes.func,
  count: PropTypes.number,
};

const mapStateToProps = state => ({
  loading: state.applicationDecisions.loading,
  decisions: state.applicationDecisions.decisions,
  count: state.applicationDecisions.count,
});

const mapDispatchToProps = dispatch => ({
  loadDecisions: params => dispatch(loadApplicationDecisions(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(PartnerDecisions);
