import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import Typography from 'material-ui/Typography';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerVerifications } from '../../../../../reducers/partnerVerifications';
import { formatDateForPrint } from '../../../../../helpers/dates';
import GridColumn from '../../../../common/grid/gridColumn';
import SpreadContent from '../../../../common/spreadContent';
import {selectPartnerFlags, selectPartnerFlagsCount} from '../../../../../store';
import FlagSummaryContainer from './flagsSummaryContainer';

const messages = {
  title: 'Flag status details',
  header: 'This Profile has',
  yelFlag: 'Yellow',
  redFlag: 'Red',
  connector: 'and',
  singleFlag: 'flag',
  multipleFlags: 'flags',
};

function flagText(_, flag, color) {
  if (flag) {
    return `${flag} ${color} ${flag > 1 ? messages.multipleFlags : messages.singleFlag}`
  }
  return '';
}

function buildHeader(_, yelFlag, redFlag) {
  const connector = (yelFlag && redFlag) ? messages.connector : '';
  if (yelFlag || redFlag) {
    return `${messages.header} ${flagText(yelFlag, messages.yelFlag)} ${connector} ${flagText(redFlag, messages.redFlag)}`;
  }
  return '';
}


const FlagSummaryModal = (props) => {
  const { dialogOpen, handleDialogClose, yelFlag, redFlag } = props;
  return (
    <div>
      <ControlledModal
        maxWidth="md"
        title={messages.title}
        trigger={dialogOpen}
        handleDialogClose={handleDialogClose}
        info={{
          title: buildHeader(yelFlag, redFlag),
        }}
        buttons={{}}
        content={<FlagSummaryContainer />}
      />
    </div >
  );
};


FlagSummaryModal.propTypes = {
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
};

export default FlagSummaryModal;
