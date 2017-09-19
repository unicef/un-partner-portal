import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import TextField from '../../forms/textFieldForm';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const messages = {
  countryProfile: 'Country Profiles',
  new: 'New',
};

const styleSheet = createStyleSheet('CountryOfficesHeader', theme => ({
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
}));

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
  handleNewCountryClick: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(CountryOfficesHeader);
