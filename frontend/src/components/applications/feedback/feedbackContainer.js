import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import { reduxForm } from 'redux-form';
import HeaderList from '../../common/list/headerList';
import { selectApplicationFeedback } from '../../../store';
import { loadApplicationFeedback, updateApplicationFeedback } from '../../../reducers/applicationFeedback';
import EmptyContent from '../../common/emptyContent';
import SpreadContent from '../../common/spreadContent';
import PaddedContent from '../../common/paddedContent';
import TextField from '../../forms/textFieldForm';
import GridColumn from '../../common/grid/gridColumn';
import { formatDateForPrint } from '../../../helpers/dates';
import { ROLES } from '../../../helpers/constants';
import FeedbackForm from './feedbackForm';

const messages = {
  title: 'Feedback',
  placeholder: 'Provide optional feedback',
  button: 'send',
  from: 'from',
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

const renderContent = (feedback, applicationId, allowedToAdd) => (<PaddedContent big>
  {feedback.map(singleFeedback => <SingleFeedback feedback={singleFeedback} />)}
  {allowedToAdd && <FeedbackForm applicationId={applicationId} />}
</PaddedContent>);


class FeedbackContainer extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        page: 1,
        page_size: 10,
      },
    };
  }
  componentWillMount() {
    this.props.loadFeedback(this.state.params);
  }
  render() {
    const { applicationId, loading, feedback, allowedToAdd } = this.props;
    return (
      <HeaderList
        header={
          <Typography type="headline" >
            {messages.title}
          </Typography>
        }
        loading={loading}
        rows={[renderContent(feedback, applicationId, allowedToAdd)]}
      />
    );
  }
}

FeedbackContainer.propTypes = {
  loading: PropTypes.bool,
  feedback: PropTypes.array,
  loadFeedback: PropTypes.func,
  allowedToAdd: PropTypes.bool,
  postFeedback: PropTypes.func,
  applicationId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps;
  return {
    loading: state.applicationFeedback.status.loading,
    feedback: selectApplicationFeedback(state, applicationId),
    allowedToAdd: state.session.role === ROLES.AGENCY,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadFeedback: params => dispatch(loadApplicationFeedback(ownProps.applicationId, params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
