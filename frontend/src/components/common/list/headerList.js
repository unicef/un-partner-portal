import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Loader from '../../common/loader';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  const paddingSmall = theme.spacing.unit;
  return {
    container: {
      width: '100%',
      margin: '0',
    },
    header: {
      display: 'flex',
      backgroundColor: theme.palette.primary[100],
      padding: `0px ${padding}px 0px ${padding}px`,
      minHeight: '64px',
    },
  };
};

class HeaderList extends Component {
  render() {
    const { classes = {}, header, loading, children, paddingSmall } = this.props;
    return (
      <Paper>
        <div>
          {header && <div className={classes.header}>
            {(typeof header === 'function')
              ? React.createElement(header)
              : header
            }
          </div>}
          <Loader loading={loading}>
            <div>
              {React.Children.map(children, child => (
                <div className={classes.container}>
                  <Divider />
                  {child}
                </div>
              ))}
            </div>
          </Loader>
        </div>
      </Paper>
    );
  }
}

HeaderList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  children: PropTypes.node,
  loading: PropTypes.bool,
  paddingSmall: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'HeaderList' })(HeaderList);
