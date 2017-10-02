import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const messages = {
  countryProfile: 'Country Profiles',
  new: 'New',
};

const styleSheet = theme => ({
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    textAlign: 'right',
  },
  icon: {
    fill: theme.palette.primary[300],
    marginRight: 3,
    width: 20,
    height: 20,
  },
});

const CountryOfficesHeader = (props) => {
  const { classes, handleNewCountryClick } = props;
  return (
    <Grid align="center" container>
      <Grid xs={9} item>
        <Typography type="title" color="inherit">
          {messages.countryProfile}
        </Typography>
      </Grid>
      <Grid className={classes.right} xs={3} item>
        <Button
          color="accent"
          onClick={handleNewCountryClick}
          raised
        >
          <div className={classes.alignCenter}>
            <Add className={classes.icon} />
            {messages.new}
          </div>
        </Button>
      </Grid>
    </Grid>
  );
};

CountryOfficesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNewCountryClick: PropTypes.func.isRequired,
};

export default withStyles(styleSheet, { name: 'CountryOfficesHeader' })(CountryOfficesHeader);
