import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';

const messages = {
  header: 'Calls for Expressions of Interest',
};

const styleSheet = createStyleSheet('sidebarMenu', (theme) => {
  const padding = theme.spacing.unit * 4;
  return {
    container: {
      width: '100%',
      margin: '0',
      padding: `${padding}px 0 0 ${padding}px`,
      borderBottom: `2px ${theme.palette.grey[300]} solid`,
    },
    logo: {
      padding: 15,
      margin: 'auto',
      background: theme.palette.primary[500],
    },
    icon: {
      color: 'inherit',
    },
    button: {
      '&:hover': {
        backgroundColor: theme.palette.primary[200],
        color: theme.palette.accent[500],
      },
      '&.active': {
        backgroundColor: theme.palette.primary[200],
        color: theme.palette.accent[500],
      },
    },
  };
});

const renderTabs = tabs => tabs.map((tab, index) => (
  <Tab label={tab.label} key={index} />
));


class CfeiHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.handleChange(null, this.state.index);
  }

  handleChange(event, index) {
    const { tabs } = this.props;
    this.setState({ index });
    history.push(tabs[index].path);
  }


  render() {
    const { classes, tabs, children } = this.props;
    return (
      <Grid item>
        <Grid className={classes.container} container direction="column" gutter={16}>
          <div>
            <Typography type="headline">
              {messages.header}
            </Typography>
          </div>
          <div>
            <Tabs index={this.state.index} onChange={this.handleChange}>
              {renderTabs(tabs)}
            </Tabs>
          </div>
        </Grid>
        {children}
      </Grid>
    );
  }
}

CfeiHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  tabs: state.cfeiNav,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

const containerCfeiHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiHeader);

export default withStyles(styleSheet)(containerCfeiHeader);
