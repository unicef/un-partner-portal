import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import GridColumn from '../../../../common/grid/gridColumn';
import { updateApplication } from '../../../../../reducers/partnerApplicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';

const messages = {
  accept: 'Accept',
  acceptText: 'You can accept selection on the partner\'s behalf.',
  withdraw: 'Withdraw',
};


const SingleAward = (props) => {
  const { partner, isFocalPoint, acceptSelection, withdrawPartner } = props;
  const displayAccept = isFocalPoint && partner.application_status === 'Application Successful';
  const displayWithdraw = partner.application_status !== 'Selection Retracted';
  return (<GridColumn>
    <Typography>{partner.partner_name}</Typography>
    <Typography type="caption">{partner.application_status}</Typography>
    {displayAccept && <Typography type="caption">{messages.acceptText}</Typography>}
    {(displayAccept || displayWithdraw) &&
      <Grid container justify="flex-end">
        {displayWithdraw && <Grid item>
          <Button color="accent" onClick={withdrawPartner} >{messages.withdraw}</Button>
        </Grid>}
        {displayAccept && <Grid item>
          <Button color="accent" onClick={acceptSelection}>{messages.accept}</Button>
        </Grid>}
      </Grid>
    }
  </GridColumn>);
};

SingleAward.propTypes = {
  partner: PropTypes.object,
  isFocalPoint: PropTypes.bool,
  acceptSelection: PropTypes.func,
  withdrawPartner: PropTypes.func,
};


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false }))
    .then(() => { dispatch(loadCfei(id)); }),
  withdrawPartner: () => dispatch(updateApplication(partner.id,
    { did_withdraw: true }))
    .then(() => { dispatch(loadCfei(id)); }),
});

export default connect(null, mapDispatchToProps)(SingleAward);
