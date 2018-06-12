import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import SvgIcon from 'material-ui/SvgIcon';
import { updateApplication } from '../../../../../reducers/applicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';
import { selectApplicationCurrentStatus, selectExtendedApplicationStatuses, isCfeiCompleted, isCfeiPublished, selectCfeiStatus } from '../../../../../store';
import VerificationIcon from '../../../../partners/profile/icons/verificationIcon';

const messages = {
  accept: 'Accept',
  isDraftText: 'Selected partner will not be notified before sending (publishing) this direct selection/retention.',
  isPublishedText: 'Waiting for Partner\'s acceptance.',
  justificationWaiver: 'Justification for direct selection/retention',
  justificationSummary: 'Justification summary',
  accepted: 'Accepted by Partner',
  declined: 'Declined by Partner',
};

const styleSheet = theme => ({
  Suc: {
    color: theme.palette.common.purple,
  },
  Acc: {
    color: theme.palette.common.lightGreen,
  },
  Dec: {
    color: theme.palette.common.orange,
  },
  root: {
    paddingTop: theme.spacing.unit,
    display: 'flex',
    alignItems: 'top',
  },
  rootCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});
const status = (classes, currentStatus, msg, isPublished) => {
  const colorClass = classNames(classes[currentStatus]);

  return (<div className={classes.root}>
    {isPublished && <SvgIcon className={colorClass}>
      <circle cx="10" cy="8" r="4" />
    </SvgIcon>}
    <Typography type="caption">
      {msg}
    </Typography>
  </div>);
};

const SingleSelectedPartner = (props) => {
  const { partner,
    classes,
    cfeiPublished,
    cfeiCompleted,
    currentStatus,
    isCfeiDraft,
    isCfeiSent,
    isAccepted } = props;

  return (
    <div>
      <div className={classes.rootCenter}>
        <Typography>{partner.partner_name}</Typography>
        <VerificationIcon
          verified={partner.partner_is_verified}
          small
        />
      </div>
      {(isCfeiDraft || isCfeiSent)
          && status(classes, currentStatus, messages.isDraftText, false)
      }
      {!cfeiCompleted && cfeiPublished
          && status(classes, currentStatus, messages.isPublishedText, cfeiPublished)}

      {cfeiCompleted
        && status(classes, currentStatus,
          isAccepted ? messages.accepted : messages.declined, cfeiCompleted)}
    </div>);
};

SingleSelectedPartner.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object,
  currentStatus: PropTypes.string,
  cfeiCompleted: PropTypes.bool,
  cfeiPublished: PropTypes.bool,
  isCfeiDraft: PropTypes.bool,
  isCfeiSent: PropTypes.bool,
  isAccepted: PropTypes.bool,
};

const mapStateToProps = (state, {
  id: eoiId,
  partner: { id } }) => {
  const directJustifications = state.partnerProfileConfig['direct-justifications'];
  const currentStatus = selectApplicationCurrentStatus(state, id);
  const cfeiCompleted = isCfeiCompleted(state, eoiId);
  const cfeiPublished = isCfeiPublished(state, eoiId);
  const cfeiStatus = selectCfeiStatus(state, eoiId);
  const isCfeiDraft = cfeiStatus === 'Dra';
  const isCfeiSent = cfeiStatus === 'Sen';
  const isAccepted = currentStatus === 'Acc';

  return {
    cfeiPublished,
    cfeiCompleted,
    isCfeiDraft,
    isCfeiSent,
    currentStatus,
    cfeiStatus,
    isAccepted,
    directJustifications,
    applicationStatus: selectExtendedApplicationStatuses(state)[currentStatus],
  };
};


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false })),
  loadCfei: () => dispatch(loadCfei(id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SingleSelectedPartner);
export default withStyles(styleSheet, { name: 'UserStatusCell' })(connected);
