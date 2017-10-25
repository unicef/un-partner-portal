import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Loader from '../../common/loader';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    container: {
      width: '100%',
      margin: '0',
    },
    header: {
      backgroundColor: theme.palette.primary[100],
      padding: `${padding}px ${padding}px`,
    },
  };
};

class HeaderList extends Component {
  renderChildren() {
    return this.props.rows.map(item =>
      (<div className={this.props.classes.container}><Divider />
        {item}
      </div>));
  }

  render() {
    const { classes, header, loading } = this.props;
    return (
      <Paper>
        <div>
          <Grid className={classes.header} item>
            {(typeof header === 'function')
              ? React.createElement(header)
              : header
            }
          </Grid>
          <Grid item>
            <Loader loading={loading} >
              {this.renderChildren()}
            </Loader>
          </Grid>
        </div>
      </Paper>
    );
  }
}

HeaderList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.object,
  rows: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'HeaderList' })(HeaderList);
