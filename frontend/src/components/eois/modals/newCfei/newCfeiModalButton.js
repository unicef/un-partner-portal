import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';
import { checkPermission, AGENCY_PERMISSIONS, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';
import { PROJECT_TYPES } from '../../../../helpers/constants';
import ButtonWithTooltipEnabled from '../../../common/buttonWithTooltipEnabled';

const messages = {
  open: 'New cfei',
  direct: 'new direct selection/retention',
  unsolicited: 'New Unsolicited Concept Note',
  tooltipInfo: 'Please complete profile information in order to proceed.'
};

const NewCfeiModalButton = (props) => {
  const { type, handleDialogClose, handleDialogOpen, dialogOpen, hasDsPermission,
    hasOpenPermission, hasUcnPermission, isHq, isProfileComplete } = props;
  
  return (
    <Grid item>
      {hasUcnPermission && type === PROJECT_TYPES.UNSOLICITED
        ? <Grid item>
          {!isHq
            && (isProfileComplete
              ? <Button
                raised
                color="accent"
                onClick={handleDialogOpen}
              >
                {messages[type]}
              </Button>
              : <ButtonWithTooltipEnabled
                name="ucn"
                text={messages.unsolicited}
                tooltipText={messages.tooltipInfo}
                disabled
              />)}
        </Grid>
        : ((hasDsPermission && type === PROJECT_TYPES.DIRECT)
          || (hasOpenPermission && type === PROJECT_TYPES.OPEN))
        && <Button raised color="accent" onClick={handleDialogOpen}>
          {messages[type]}
        </Button>}
      <NewCfeiModal type={type} open={dialogOpen} onDialogClose={handleDialogClose} />
    </Grid>
  );
};

NewCfeiModalButton.propTypes = {
  type: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  hasDsPermission: PropTypes.bool,
  hasOpenPermission: PropTypes.bool,
  hasUcnPermission: PropTypes.bool,
  isHq: PropTypes.bool,
  isProfileComplete: PropTypes.bool,
};

const mapStateToProps = state => ({
  hasDsPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS, state),
  hasOpenPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DRAFT_CREATE, state),
  hasUcnPermission: checkPermission(PARTNER_PERMISSIONS.UCN_DRAFT, state),
  isHq: state.session.isHq,
  isProfileComplete: state.session.isProfileComplete,
});

export default compose(
  withDialogHandling,
  connect(mapStateToProps),
  withRouter)(NewCfeiModalButton);
