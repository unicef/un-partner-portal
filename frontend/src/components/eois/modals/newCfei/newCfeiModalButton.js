import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';
import withConditionalDisplay from '../../../common/hoc/withConditionalDisplay';
import { isUserNotAgencyReader } from '../../../../helpers/authHelpers';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../helpers/permissions';

const messages = {
  open: 'New cfei',
  direct: 'new direct selection/retention',
  unsolicited: 'New Unsolicited Concept Note',
};


const NewCfeiModalButton = (props) => {
  const { type, handleDialogClose, handleDialogOpen, dialogOpen, hasDsPermission, hasOpenPermission } = props;
  
  return (

    <Grid item>
      {((hasDsPermission && type === 'direct')
      || (hasOpenPermission && type === 'open')) && <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
      >
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
};


const mapStateToProps = state => ({
  hasDsPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS, state),
  hasOpenPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DRAFT_CREATE, state),
});

export default compose(
  withConditionalDisplay([isUserNotAgencyReader]),
  withDialogHandling,
  connect(mapStateToProps),
  withRouter)(NewCfeiModalButton);
