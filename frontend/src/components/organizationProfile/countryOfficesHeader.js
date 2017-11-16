import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';

const messages = {
  countryProfile: 'Country Profiles',
  new: 'New',
  disabled: 'Your profile is incomplete',
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
  const { classes, handleNewCountryClick, disableNewCountries } = props;
  return (
    <Grid align="center" container>
      <Grid xs={9} item>
        <Typography type="title" color="inherit">
          {messages.countryProfile}
        </Typography>
      </Grid>
      <Grid className={classes.right} xs={3} item>
        <Tooltip
          id="new_countries_tooltip"
          disableTriggerFocus={!disableNewCountries}
          disableTriggerHover={!disableNewCountries}
          disableTriggerTouch={!disableNewCountries}
          title={messages.disabled}
          placement="bottom"
        >
          <div>
            <Button
              color="accent"
              onClick={handleNewCountryClick}
              raised
              disabled={disableNewCountries}
            >
              <div className={classes.alignCenter}>
                <Add className={classes.icon} />
                {messages.new}
              </div>
            </Button>
          </div>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

CountryOfficesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNewCountryClick: PropTypes.func.isRequired,
  disableNewCountries: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'CountryOfficesHeader' })(CountryOfficesHeader);
