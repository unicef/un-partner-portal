import React from 'react';
import { connect } from 'react-redux'
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import TimelineComponent from '../../common/timeline';

const messages = {
  title: 'Timeline',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const Timeline = (props) => {
  const {id, deadline, start, posted, notif} = props;
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

const mapStateToProps = (state, ownProps) => ({
  deadline: state.cfeiDetails[ownProps.id].eoi.deadline_date,
  start: state.cfeiDetails[ownProps.id].eoi.start_date,
  posted: state.cfeiDetails[ownProps.id].eoi.posted_date,
  notif: state.cfeiDetails[ownProps.id].eoi.notif_results_date,
});

export default connect(
  mapStateToProps,
)(Timeline);

