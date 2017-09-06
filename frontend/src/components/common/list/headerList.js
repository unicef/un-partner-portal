import Paper from 'material-ui/Paper';
import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styleSheet = createStyleSheet('HeaderList', theme => ({
  container: {
    width: '100%',
    margin: '0',
  },
  header: {
    backgroundColor: theme.palette.primary[100],
  },
}));

class HeaderList extends Component {
  renderChildren() {
    return this.props.rows.map(item =>
      (<div><Divider />
        {item}
      </div>));
  }

  render() {
    const { classes, header } = this.props;
    return (
      <Paper>
        <Grid direction="column" className={classes.container} container>
          <Grid className={classes.header} item>
            {createElement(header)}
          </Grid>
          {this.renderChildren()}
        </Grid>
      </Paper>
    );
  }
}

HeaderList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.func.isRequired,
  rows: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(HeaderList);
