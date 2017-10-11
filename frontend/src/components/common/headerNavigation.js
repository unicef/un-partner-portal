
import React, { Component, createElement } from 'react';
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
    container: {
      width: '100%',
      margin: '0',
      padding: `${padding}px ${biggerPadding}px 0 ${biggerPadding}px`,
      borderBottom: `2px ${theme.palette.grey[300]} solid`,
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
      alignItems: 'center',
      paddingBottom: `${padding}px`,
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
      tabs,
      customTabs,
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
      <div>
        <Grid align="center" className={classes.container} container>
          <SpreadContent >
            <div className={paddingClass}>
              { backButton
                ? <IconButton onClick={handleBackButton}>
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
          {tabs
            ? <div>
              <Tabs value={index} onChange={handleChange}>
                {customTabs ? customTabs.map(tab => tab) : tabs}
              </Tabs>
            </div>
            : null
          }
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
  customTabs: PropTypes.node,
  children: PropTypes.node,
  header: PropTypes.Component,
  handleChange: PropTypes.Func,
};

export default withStyles(styleSheet, { name: 'HeaderNavigation' })(HeaderNavigation);
