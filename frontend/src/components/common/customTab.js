import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import { Tab } from 'material-ui/Tabs';
import ReportProblemIcon from 'material-ui-icons/ReportProblem';
import CheckCircle from 'material-ui-icons/CheckCircle';
import { withStyles } from 'material-ui/styles';


const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit / 2;

  return {
    rootPrimarySelected: {
      color: theme.palette.secondary[500],
    },
    rootInheritSelected: {
      color: theme.palette.secondary[500],
    },
    checked: {
      fill: '#189a58',
      margin: `0 0 0 ${paddingIcon}px`,
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
  };
};

const CustomTab = (props) => {
  const { classes, warn, checked, label, ...tabProps } = props;
  return (
    <Tab
      label={[
        label,
        warn && <Icon color="error"><ReportProblemIcon /></Icon>,
        checked && <CheckCircle className={classes.checked} />,
      ]}
      classes={{
        rootPrimarySelected: classes.rootPrimarySelected,
        rootInheritSelected: classes.rootInheritSelected,
        label: (warn || checked) && classes.label,
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
  checked: PropTypes.bool,
};


export default withStyles(styleSheet, { name: 'CustomTab' })(CustomTab);
