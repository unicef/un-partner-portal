import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const messages = {
  mailing: 'Organization\'s mailing Address',
  phone: 'Organization\'s generic Phone number',
  website: 'Website',
  headName: 'Name of Head',
  headTitle: 'Title of Head',
  headEmail: 'Email of Head',
  languages: 'Working languages',
  specialisation: 'Sector and areas of specialisation',
  education: 'Education',
  food: 'Food Security',
  health: 'Health',
};

const styleSheet = createStyleSheet('CountryOfficesHeader', (theme) => {
  const padding = theme.spacing.unit;
  const paddingSmall = theme.spacing.unit * 2;
  const paddingMedium = theme.spacing.unit * 4;
  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    row: {
      display: 'flex',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
    },
    icon: {
      fill: theme.palette.primary[300],
      marginRight: 3,
      width: 20,
      height: 20,
    },
    container: {
      width: '100%',
      margin: '0',
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
    },
  };
});

/*const ItemColumnCell = (values) => {
  const { label, content } = values;
  return (
    <Grid container>

    </Grid>
  );
}; */

PartnerProfileDetailItem.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(PartnerProfileDetailItem);
