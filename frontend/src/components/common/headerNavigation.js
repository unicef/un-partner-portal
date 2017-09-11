import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tabs from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import CustomTab from '../common/customTab';

const styleSheet = createStyleSheet('HeaderNavigation', (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    container: {
      width: '100%',
      margin: '0',
      padding: `${padding}px 0 0 ${padding}px`,
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
});

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
      children,
      header,
      handleChange } = this.props;

    return (
      <div>
        <Grid align="center" className={classes.container} container>
          <Grid item xs={8}>
            <div className={tabs ? classes.alignItems : classes.alignItemsPadding}>
              { backButton ?
                <IconButton onClick={handleBackButton}>
                  <KeyboardArrowLeft />
                </IconButton>
                : null }
              { title ?
                <Typography type="headline">
                  {title}
                </Typography>
                : titleObject }
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.right}>
              {header}
            </div>
          </Grid>
          {tabs ?
            <div>
              <Tabs index={index} onChange={handleChange}>
                {this.renderTabs()}
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
  children: PropTypes.node,
  header: PropTypes.Component,
  handleChange: PropTypes.Func,
};

export default withStyles(styleSheet)(HeaderNavigation);
