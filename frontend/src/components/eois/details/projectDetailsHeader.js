import Typography from 'material-ui/Typography';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import TextField from '../../forms/textFieldForm';

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
  const { classes } = props;
  return (
    <Grid align="center" container>
      <Grid xs={9} item>
        <Typography type="title" color="inherit">
          {messages.countryProfile}
        </Typography>
      </Grid>
      <Grid className={classes.right} xs={3} item>
        <TextField
          fieldName="id"
          label={messages.labels.id}
          readOnly
        />
      </Grid>
    </Grid>
  );
};

CountryOfficesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet, { name: 'CountryOfficesHeader' })(CountryOfficesHeader);
