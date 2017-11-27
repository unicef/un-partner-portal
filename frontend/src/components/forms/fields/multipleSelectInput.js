
import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  input: {
    flexGrow: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

const MultipleSelectInput = (props) => {
  const { classes,
    multiValues,
    placeholder,
    handleClear,
    inputRef,
    ...other } = props;
  return (
    <Grid container alignItems="center" spacing={8}>
      {!R.isEmpty(multiValues)
        && multiValues.map((value, index) =>
          (<Grid item key={`${value}-${index}`}>
            <Grid container alignItems="center" spacing={0}>
              {value}
              <IconButton
                className={classes.icon}
                color="accent"
                onClick={() => { handleClear(index); }}
              >
                <Clear />
              </IconButton>
            </Grid>
          </Grid>))}
      <Grid className={classes.input} item>
        <input ref={(node) => { inputRef(node); }} placeholder={R.isEmpty(multiValues) ? placeholder : ''} {...other} />
      </Grid>
    </Grid>
  );
};

MultipleSelectInput.propTypes = {
  classes: PropTypes.object,
  /**
   * array of values to render along with input
   */
  multiValues: PropTypes.array,
  /**
   * function to clear one value by pressing 'x' button
   */
  handleClear: PropTypes.func,
  placeholder: PropTypes.string,
};

export default withStyles(styles, { name: 'MultipleSelectInput' })(MultipleSelectInput);
