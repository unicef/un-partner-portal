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

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    deadline: cfei && cfei.deadline_date,
    start: cfei && cfei.start_date,
    posted: cfei && cfei.created_date,
    notif: cfei && cfei.notif_results_date,
  };
};

export default connect(
  mapStateToProps,
)(Timeline);

