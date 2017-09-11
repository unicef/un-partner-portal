import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Tabs from 'material-ui/Tabs';
import CustomTab from '../common/customTab';
import NewCfeiModalButton from './modals/newCfeiModalButton';

const messages = {
  partner: 'Calls for Expressions of Interest',
  agency: 'Expression of Interests',
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
  <CustomTab label={tab.label} key={index} />
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
    if (this.props.location.pathname === '/cfei') {
      this.handleChange(null, this.state.index);
    }
  }

  handleChange(event, index) {
    const { tabs } = this.props;
    this.setState({ index });
    history.push(tabs[index].path);
  }


  render() {
    const { classes, tabs, children, role, params: { type, id } } = this.props;
    return (
      <Grid item>
        <Grid className={classes.container} container direction="column" gutter={16}>
          <Grid item>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Typography type="headline">
                  {messages[role]}
                </Typography>
              </Grid>
              {!id && type && role === 'agency' && <NewCfeiModalButton />
              }
            </Grid>
          </Grid>
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
  role: PropTypes.string,
  location: PropTypes.object,
};

const mapStateToProps = state => ({
  tabs: state.cfeiNav,
  role: state.session.role,
});

const containerCfeiHeader = connect(
  mapStateToProps,
)(CfeiHeader);

export default withStyles(styleSheet)(containerCfeiHeader);
