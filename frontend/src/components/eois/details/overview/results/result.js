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
  expected: (_, notifDate) => `Results are expected to be made by: ${formatDateForPrint(notifDate)}`,
};


const Fields = (application, notifDate) => {
  if (application.did_win && notifDate) {
    return <ResultForm notifDate={notifDate} application={application} />;
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
  return (<HeaderList
    header={<Typography type="subheading" >{messages.title}</Typography>}
    rows={[Fields(application, notifDate)]}
  />);
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
