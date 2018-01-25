import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import GridColumn from '../../../../common/grid/gridColumn';
import { updateApplication } from '../../../../../reducers/applicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';
import { selectApplicationCurrentStatus, selectExtendedApplicationStatuses, isCfeiCompleted } from '../../../../../store';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';

const messages = {
  accept: 'Accept',
  acceptText: 'You can accept selection on the partner\'s behalf.',
  withdraw: 'Withdraw',
};


const SingleSelectedPartner = (props) => {
  const { partner,
    loadCfei,
    applicationStatus,
    acceptSelection,
    displayAccept,
    displayWithdraw } = props;
  return (<GridColumn>
    <Typography>{partner.partner_name}</Typography>
    <Typography type="caption">{applicationStatus}</Typography>
    {displayAccept && <Typography type="caption">{messages.acceptText}</Typography>}
    {(displayAccept || displayWithdraw) &&
      <Grid container justify="flex-end">
        {displayWithdraw && <Grid item>
          <WithdrawApplicationButton
            applicationId={partner.id}
          />
        </Grid>}
        {displayAccept && <Grid item>
          <Button color="accent" onClick={() => { acceptSelection().then(loadCfei); }}>{messages.accept}</Button>
        </Grid>}
      </Grid>
    }
  </GridColumn>);
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
