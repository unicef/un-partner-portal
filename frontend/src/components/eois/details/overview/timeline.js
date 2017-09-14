import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HeaderList from '../../../common/list/headerList';
import TimelineComponent from '../../../common/timeline';


const messages = {
  title: 'Timeline',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const Timeline = (props) => {
  const { deadline, start, posted, notif } = props;
  return (
    <HeaderList
      header={title}
      rows={[<TimelineComponent
        postedDate={posted}
        deadlineDate={deadline}
        notificationDate={notif}
        startDate={start}
      />]}
    />
  );
};

Timeline.propTypes = {
  posted: PropTypes.string,
  deadline: PropTypes.string,
  notif: PropTypes.string,
  start: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  deadline: state.cfeiDetails[ownProps.id].eoi.deadline_date,
  start: state.cfeiDetails[ownProps.id].eoi.start_date,
  posted: state.cfeiDetails[ownProps.id].eoi.posted_date,
  notif: state.cfeiDetails[ownProps.id].eoi.notif_results_date,
});

export default connect(
  mapStateToProps,
)(Timeline);

