import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import GridColumn from '../../../../common/grid/gridColumn';
import { updateApplication } from '../../../../../reducers//applicationDetails';
import { selectApplicationCurrentStatus, selectNewApplicationStatuses } from '../../../../../store';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';

const messages = {
  accept: 'Accept',
  acceptText: 'You can accept selection on the partner\'s behalf.',
  withdraw: 'Withdraw',
};


const SingleSelectedPartner = (props) => {
  const { partner, isFocalPoint, acceptSelection, applicationStatus } = props;
  const displayAccept = isFocalPoint && applicationStatus === 'Application Successful';
  const displayWithdraw = isFocalPoint && applicationStatus !== 'Selection Retracted';
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
          <Button color="accent" onClick={acceptSelection}>{messages.accept}</Button>
        </Grid>}
      </Grid>
    }
  </GridColumn>);
};

SingleSelectedPartner.propTypes = {
  partner: PropTypes.object,
  isFocalPoint: PropTypes.bool,
  acceptSelection: PropTypes.func,
  applicationStatus: PropTypes.string,
};

const mapStateToProps = (state, { partner: { id } }) => ({
  applicationStatus: selectNewApplicationStatuses(state)[selectApplicationCurrentStatus(state, id)],
});


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSelectedPartner);
