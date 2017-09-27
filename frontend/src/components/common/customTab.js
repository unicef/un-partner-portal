
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import { Tab } from 'material-ui/Tabs';
import ReportProblemIcon from 'material-ui-icons/ReportProblem';

import { withStyles } from 'material-ui/styles';


const styleSheet = theme => ({
  rootPrimarySelected: {
    color: theme.palette.accent[500],
  },
  rootInheritSelected: {
    color: theme.palette.accent[500],
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.fontSize,
    whiteSpace: 'normal',
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.fontSize - 1,
    },
  },
});

const CustomTab = (props) => {
  const { classes, warn, label, ...tabProps } = props;
  return (
    <Tab
      label={[
        label,
        warn && <Icon color="error"><ReportProblemIcon /></Icon>,
      ]}
      classes={{
        rootPrimarySelected: classes.rootPrimarySelected,
        rootInheritSelected: classes.rootInheritSelected,
        label: warn && classes.label,
      }}
      {...tabProps}
    />
  );
};

CustomTab.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string,
  iconStyle: PropTypes.string,
  warn: PropTypes.bool,
};


export default withStyles(styleSheet, { name: 'CustomTab' })(CustomTab);
