
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const messages = {
  edit: 'Edit',
  lastUpdate: 'Last update: ',
};

const styleSheet = createStyleSheet('HqProfileOverviewHeader', (theme) => {
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
  };
});

const OrganizationProfileOverviewHeader = (props) => {
  const { classes, update, handleEditClick } = props;

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        <Typography type="body1" color="inherit"> {messages.lastUpdate} {update}</Typography>
      </div>
      <Button onClick={handleEditClick} raised color="accent">
        {messages.edit}
      </Button>
    </div>
  );
};

OrganizationProfileOverviewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  update: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(OrganizationProfileOverviewHeader);
