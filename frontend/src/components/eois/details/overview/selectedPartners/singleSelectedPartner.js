import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../common/grid/gridColumn';
import { updateApplication } from '../../../../../reducers/applicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';
import { selectApplicationCurrentStatus, selectExtendedApplicationStatuses, isCfeiCompleted, isCfeiPublished, selectCfeiStatus, selectNormalizedDirectJustification } from '../../../../../store';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';
import VerificationIcon from '../../../../partners/profile/icons/verificationIcon';

const messages = {
  accept: 'Accept',
  isDraftText: 'Selected partner will not be notified before sending (publishing) this waiver of open selection.',
  isPublishedText: 'Selected partner will not be notified before sending (publishing) this waiver of open selection.',
  withdraw: 'Withdraw',
  justificationWaiver: 'Justification for direct selection/retention',
  justificationSummary: 'Justification summary',
};

const styles = {
  display: 'flex',
  alignItems: 'center',
};

const SingleSelectedPartner = (props) => {
  const { partner,
    isCfeiPublished, isCfeiCompleted, isCfeiDraft, isAccepted, isDeclined } = props;
  return (
    <div>
      <div style={styles}>
        <Typography>{partner.partner_name}</Typography>
        <VerificationIcon
          verified
          small
        />
      </div>
      {isCfeiDraft
          && <Typography type="caption">{messages.isDraftText}</Typography>}
      {isCfeiPublished
          && !isAccepted
          && !isDeclined
          && <Typography type="caption">{messages.isPublishedText}</Typography>}
      {/* tutaj szara kropka */}

      {(isAccepted || isDeclined) && <Typography type="caption">{messages.isPublishedText}</Typography>}
    {/* tutaj zielona */}
    </div>);
};

SingleSelectedPartner.propTypes = {
  partner: PropTypes.object,
  applicationStatus: PropTypes.string,
  loadCfei: PropTypes.func,
  directJustifications: PropTypes.array,
  isCfeiCompleted: PropTypes.bool,
  isCfeiPublished: PropTypes.bool,
  isCfeiDraft: PropTypes.bool,
};

const mapStateToProps = (state, {
  isFocalPoint,
  id: eoiId,
  partner: { id } }) => {
  const directJustifications = state.partnerProfileConfig['direct-justifications'];
  const currentStatus = selectApplicationCurrentStatus(state, id);
  const cfeiCompleted = isCfeiCompleted(state, eoiId);
  const cfeiPublished = isCfeiPublished(state, eoiId);
  const checkDraft = selectCfeiStatus(state, eoiId);
  const isCfeiDraft = checkDraft === 'Dra';
  const isAccepted = currentStatus === 'Acc';
  const isDeclined = currentStatus === 'Dec';
  console.log(currentStatus);
  return {
    isCfeiPublished: cfeiPublished,
    isCfeiCompleted: cfeiCompleted,
    isCfeiDraft,
    isAccepted,
    isDeclined,
    directJustifications,
    applicationStatus: selectExtendedApplicationStatuses(state)[currentStatus],
  };
};


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false })),
  loadCfei: () => dispatch(loadCfei(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSelectedPartner);
