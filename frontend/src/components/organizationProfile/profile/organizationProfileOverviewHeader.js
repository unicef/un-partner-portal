import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import OrganizationProfileHeaderOptions from './organizationProfileHeaderOptions';
import withConditionalDisplay from '../../common/hoc/withConditionalDisplay';
import { isUserNotPartnerReader } from '../../../helpers/authHelpers';
import { isUserHq, selectUserHqId } from '../../../store';

const messages = {
  edit: 'Edit',
  lastUpdate: 'Last update: ',
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const padding = theme.spacing.unit * 4;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: `${paddingSmall}px`,
    },
    text: {
      color: theme.palette.primary[400],
      padding: `0 ${padding}px 0 ${padding}px`,
    },
    noPrint: {
      '@media print': {
        visibility: 'hidden',
        display: 'none',
      },
    },
  };
};

const showEdit = partnerId => state => !(!isUserHq(state) && selectUserHqId(state) === +partnerId);

const OrganizationProfileOverviewHeader = (props) => {
  const { classes, update, partnerId, handleEditClick } = props;
  const EditProfileButton = withConditionalDisplay([isUserNotPartnerReader, showEdit(partnerId)])(() => (
    <Button className={classes.noPrint} onClick={handleEditClick} raised color="accent">
      {messages.edit}
    </Button>
  ));
  return (
    <div className={classes.root}>
      <div className={classes.text}>
        <Typography type="body1" color="inherit"> {messages.lastUpdate} {update}</Typography>
      </div>
      <EditProfileButton />
      <OrganizationProfileHeaderOptions className={classes.noPrint} />
    </div>
  );
};

OrganizationProfileOverviewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  update: PropTypes.string.isRequired,
  partnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withStyles(styleSheet, { name: 'OrganizationProfileOverviewHeader' })(OrganizationProfileOverviewHeader);
