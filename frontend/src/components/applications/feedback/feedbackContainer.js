import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import R from 'ramda';
import Grid from 'material-ui/Grid';
import HeaderList from '../../common/list/headerList';
import { selectApplicationFeedback, selectApplicationFeedbackCount } from '../../../store';
import { loadApplicationFeedback } from '../../../reducers/applicationFeedback';
import SpreadContent from '../../common/spreadContent';
import PaddedContent from '../../common/paddedContent';
import GridColumn from '../../common/grid/gridColumn';
import { formatDateForPrint } from '../../../helpers/dates';
import { ROLES } from '../../../helpers/constants';
import FeedbackForm from './feedbackForm';
import Pagination from '../../common/pagination';
import EmptyContent from '../../common/emptyContent';

const messages = {
  title: 'Comments',
  placeholder: 'Provide optional feedback',
  button: 'send',
  from: 'from',
  noInfo: 'No information available yet.',
  for: 'for',
};

const SingleFeedback = ({ feedback }) => (<GridColumn>
  <SpreadContent>
    <Typography type="body2">
      {`${feedback.provider.name} ${messages.from} ${feedback.provider.agency_name}`}
    </Typography>
    <Typography type="caption">
      {formatDateForPrint(feedback.created)}
    </Typography>
  </SpreadContent>
  <Typography >
    {feedback.feedback}
  </Typography>
  <Divider />
</GridColumn>);

class FeedbackContainer extends Component {
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
    if (this.props.applicationId) {
      this.props.loadFeedback(this.state.params);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!R.equals(nextState.params, this.state.params)) {
      this.props.loadFeedback(nextState.params);
      return false;
    } else if (!this.props.applicationId && nextProps.applicationId) {
      this.props.loadFeedback(nextState.params);
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

  render() {
    const { applicationId, loading, feedback, allowedToAdd, count, extraTitle } = this.props;
    const { params: { page, page_size } } = this.state;
    return (
      <HeaderList
        header={
          <Typography type="headline" >
            {extraTitle ? `${messages.title} ${messages.for} ${extraTitle}` : messages.title}
          </Typography>
        }
        loading={loading}
      >
        {(R.isEmpty(feedback) && !allowedToAdd) ? loading
            ? <EmptyContent />
            : <PaddedContent big><Typography>{messages.noInfo}</Typography></PaddedContent>
          : <PaddedContent big>
            {allowedToAdd && <FeedbackForm applicationId={applicationId} />}
            {feedback.map(singleFeedback => (<SingleFeedback
              key={singleFeedback.id}
              feedbackId={singleFeedback.id}
              feedback={singleFeedback}
            />))}
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
          </PaddedContent>}
      </HeaderList>
    );
  }
}

FeedbackContainer.propTypes = {
  loading: PropTypes.bool,
  feedback: PropTypes.array,
  loadFeedback: PropTypes.func,
  allowedToAdd: PropTypes.bool,
  applicationId: PropTypes.number,
  count: PropTypes.number,
  extraTitle: PropTypes.string,
  feedbackId: PropTypes.string,
};

FeedbackContainer.defaultProps = {
  feedbackId: 'default',
};

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps;
  return {
    loading: state.applicationFeedback.status.loading[ownProps.feedbackId],
    feedback: selectApplicationFeedback(state, applicationId),
    count: selectApplicationFeedbackCount(state, applicationId),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadFeedback: params => dispatch(loadApplicationFeedback(ownProps.applicationId, params, ownProps.feedbackId)),
});


export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
