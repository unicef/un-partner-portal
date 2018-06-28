import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../../components/common/grid/gridColumn';
import GridRow from '../../../../components/common/grid/gridRow';
import PaddedContent from '../../../../components/common/paddedContent';

const messages = {
  role: 'Role per Office',
  noData: 'No data.',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  const paddingSmall = theme.spacing.unit / 2;
  const paddingMedium = theme.spacing.unit * 2;

  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    alignText: {
      textAlign: 'center',
    },
    row: {
      display: 'flex',
    },
    padding: {
      padding: `0 0 ${padding}px 0`,
    },
    paddingSmall: {
      padding: `0 0 ${paddingSmall}px 0`,
    },
    icon: {
      fill: theme.palette.primary[300],
      marginRight: 3,
      width: 20,
      height: 20,
    },
    container: {
      width: '100%',
      margin: '0',
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
    },
  };
};

const UserDetailsExpand = (props) => {
  const { classes, user } = props;
  if (user) {
    return (
      <div className={classes.container}>
        <Typography className={classes.padding} type="caption">{messages.role}</Typography>
        {user.office_memberships.map(item => (
          <Typography className={classes.paddingSmall} type="body1">
            {item.office && item.office.name} - {item.role_display}</Typography>),
        )}
      </div>
    );
  }

  return (<PaddedContent big>
    <div className={classes.alignText}>{messages.noData}</div>
  </PaddedContent>);
};

UserDetailsExpand.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'UserDetailsExpand' })(UserDetailsExpand);
