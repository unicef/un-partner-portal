import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import TimelineComponent from '../../../common/timeline';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  title: 'Timeline',
};

const title = () => (
  <Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>
);

const Timeline = (props) => {
  const { deadline, start, posted, notif, clarification } = props;
  return (
    <HeaderList
      header={title}
    >
      <TimelineComponent
        clarificationDate={clarification}
        postedDate={posted}
        deadlineDate={deadline}
        notificationDate={notif}
        startDate={start}
      />
    </HeaderList>
  );
};

Timeline.propTypes = {
  posted: PropTypes.string,
  deadline: PropTypes.string,
  notif: PropTypes.string,
  start: PropTypes.string,
  clarification: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    clarification: cfei && cfei.clarification_request_deadline_date,
    deadline: cfei && cfei.deadline_date,
    start: cfei && cfei.start_date,
    posted: cfei && (cfei.published_timestamp || cfei.created),
    notif: cfei && cfei.notif_results_date,
  };
};

export default connect(
  mapStateToProps,
)(Timeline);

