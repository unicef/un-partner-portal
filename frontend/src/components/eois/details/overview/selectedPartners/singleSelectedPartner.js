import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../common/grid/gridColumn';
import { updateApplication } from '../../../../../reducers/applicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';
import { selectApplicationCurrentStatus, selectExtendedApplicationStatuses, isCfeiCompleted, selectDirectSelectionJustificationReason } from '../../../../../store';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';

const messages = {
  accept: 'Accept',
  acceptText: 'Selected partner will not be notified before sending (publishing) this waiver of open selection.',
  withdraw: 'Withdraw',
  justificationWaiver: 'Justification for waiver of open selection',
  justificationSummary: 'Justification summary',
};


const SingleSelectedPartner = (props) => {
  const { partner,
    loadCfei,
    applicationStatus,
    acceptSelection,
    displayAccept,
    displayWithdraw } = props;
  return (
    <div><GridColumn>
      <Typography>{partner.partner_name}</Typography>
      {/* <Typography type="caption">{applicationStatus}</Typography> */}
      {displayAccept && <Typography type="caption">{messages.acceptText}</Typography>}
      <Divider />
      <Typography type="caption">{messages.justificationWaiver}</Typography>
      <Typography>{partner.justification_reason}</Typography>
      <Typography type="caption">{messages.justificationSummary}</Typography>
    </GridColumn>
    </div>);
};

SingleSelectedPartner.propTypes = {
  partner: PropTypes.object,
  displayWithdraw: PropTypes.bool,
  displayAccept: PropTypes.bool,
  acceptSelection: PropTypes.func,
  applicationStatus: PropTypes.string,
  loadCfei: PropTypes.func,
};

const mapStateToProps = (state, {
  isFocalPoint,
  id: eoiId,
  partner: { id } }) => {
  const currentStatus = selectApplicationCurrentStatus(state, id);
  const cfeiCompleted = isCfeiCompleted(state, eoiId);
  const displayAccept = isFocalPoint
    && currentStatus === 'Suc'
    && !cfeiCompleted;
  const displayWithdraw = isFocalPoint
    && currentStatus !== 'Ret'
    && !cfeiCompleted;
  return {
    displayAccept,
    displayWithdraw,
    applicationStatus: selectExtendedApplicationStatuses(state)[currentStatus],
  };
};


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false })),
  loadCfei: () => dispatch(loadCfei(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSelectedPartner);
