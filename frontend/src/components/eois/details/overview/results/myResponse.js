import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import HeaderList from '../../../../common/list/headerList';
import { selectCfeiDetails } from '../../../../../store';
import ResponseForm from './responseForm';

const messages = {
  title: 'Result',
};


const MyResponse = (props) => {
  const { application, status, cfeiId } = props;
  return (
    <HeaderList
      header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
    >
      <ResponseForm cfeiId={cfeiId} application={application} status={status} />
    </HeaderList>
  );
};

MyResponse.propTypes = {
  status: PropTypes.string,
  cfeiId: PropTypes.string,
  application: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.cfeiId) || {};
  const { status } = cfei;
  return {
    status,
    cfeiId: ownProps.cfeiId,
  };
};

export default connect(mapStateToProps)(MyResponse);
