import Paper from 'material-ui/Paper';
import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styleSheet = createStyleSheet('HeaderList', (theme) => {
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
});

class HeaderList extends Component {
  renderChildren() {
    return this.props.rows.map(item =>
      (<div><Divider />
        {item}
      </div>));
  }

  render() {
    const { classes, header, headerObject } = this.props;
    return (
      <Paper>
        <Grid direction="column" className={classes.container} container gutter={0}>
          <Grid className={classes.header} item>
            {header ? createElement(header) : headerObject}
          </Grid>
          {this.renderChildren()}
        </Grid>
      </Paper>
    );
  }
}

HeaderList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.func,
  headerObject: PropTypes.object,
  rows: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(HeaderList);
