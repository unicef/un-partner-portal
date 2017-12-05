
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tabs from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import className from 'classnames';
import CustomTab from '../common/customTab';
import SpreadContent from '../common/spreadContent';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  const biggerPadding = theme.spacing.unit * 3;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    container: {
      width: '100%',
      margin: '0',
      padding: `${padding}px ${biggerPadding}px 0 ${biggerPadding}px`,
      borderBottom: `2px ${theme.palette.grey[300]} solid`,
      '@media print': {
        borderBottom: '0',
      },
    },
    alignItems: {
      display: 'flex',
      alignItems: 'center',
    },
    right: {
      alignItems: 'right',
    },
    alignItemsPadding: {
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: `${padding}px`,
    },
    flex: {
      alignItems: 'flex-end',
    },
    backButtonHeight: {
      height: 24,
    },
    noPrint: {
      '@media print': {
        visibility: 'hidden',
        display: 'none',
      },
    },
  };
};

class HeaderNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  renderTabs() {
    return this.props.tabs.map((tab, index) => (
      <CustomTab label={tab.label} key={index} />
    ));
  }

  render() {
    const {
      classes,
      index,
      title,
      titleObject,
      backButton,
      handleBackButton,
      customTabs,
      tabs,
      children,
      header,
      handleChange } = this.props;
    const paddingClass = className(
      {
        [classes.alignItems]: tabs,
        [classes.alignItemsPadding]: !tabs,
      },
    );
    const actionsClass = className(
      classes.right,
      paddingClass,
    );

    return (
      <div className={classes.root}>
        <Grid item>
          <Grid alignItems="center" className={classes.container} container>
            <SpreadContent className={classes.flex} >
              <div className={paddingClass}>
                { backButton
                  ? <IconButton
                    className={`${classes.backButtonHeight} ${classes.noPrint}`}
                    onClick={handleBackButton}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  : null }
                { typeof title === 'string'
                  ? <Typography type="headline">
                    {title}
                  </Typography>
                  : titleObject }
              </div>
              <div className={actionsClass} >
                {header}
              </div>
            </SpreadContent>
            {customTabs || tabs
              ? <div className={classes.noPrint}>
                <Tabs
                  scrollable
                  value={index}
                  scrollButtons="off"
                  textColor="accent"
                  indicatorColor="accent"
                  onChange={handleChange}
                >
                  {customTabs ? customTabs() : this.renderTabs()}
                </Tabs>
              </div>
              : null
            }
          </Grid>
        </Grid>
        {children}
      </div>
    );
  }
}

HeaderNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  title: PropTypes.string.isRequired,
  titleObject: PropTypes.object.isRequired,
  backButton: PropTypes.bool,
  handleBackButton: PropTypes.func,
  tabs: PropTypes.array,
  customTabs: PropTypes.func,
  children: PropTypes.node,
  header: PropTypes.Component,
  handleChange: PropTypes.Func,
};

export default withStyles(styleSheet, { name: 'HeaderNavigation' })(HeaderNavigation);
