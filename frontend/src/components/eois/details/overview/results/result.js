import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../../store';
import { formatDateForPrint } from '../../../../../helpers/dates';
import ResultForm from './resultForm';

const messages = {
  title: 'Result',
  retracted: 'Your selection was retracted.',
  expected: (_, notifDate) => `Notification of results will be made by: ${formatDateForPrint(notifDate)}`,
};


const Fields = (application, notifDate) => {
  if (application.did_win && notifDate && !application.did_withdraw) {
    return <ResultForm notifDate={notifDate} application={application} />;
  } else if (application.did_withdraw) {
    return (<PaddedContent>
      <Typography>
        {messages.retracted}
      </Typography>
    </PaddedContent>);
  }

  return (
    <PaddedContent>
      <Typography>
        {messages.expected`${notifDate}`}
      </Typography>
    </PaddedContent>);
};

const Result = (props) => {
  const { application, notifDate } = props;
  return (
    <HeaderList
      header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
    >
      {Fields(application, notifDate)}
    </HeaderList>
  );
};

Result.propTypes = {
  notifDate: PropTypes.string,
  application: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.cfeiId) || {};
  const { notif_results_date } = cfei;
  return {
    notifDate: notif_results_date,
  };
};

export default connect(mapStateToProps)(Result);
