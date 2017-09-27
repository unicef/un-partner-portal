import Grid from 'material-ui/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import ItemColumnCell from '../common/cell/itemColumnCell';
import ItemDynamicCell from '../common/cell/itemDynamicCell';
import PaddedContent from '../common/paddedContent';

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
  no_data: 'NO DATA',
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
    alignText: {
      textAlign: 'center',
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

const PartnerProfileDetailItem = (props) => {
  const { classes, partner } = props;

  if (partner) {
    return (<Grid className={classes.container} container direction="column" spacing={0}>
      <Grid item>
        <Grid container>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.mailing} content={partner.mail} />
          </Grid>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.phone} content={partner.phone} />
          </Grid>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.website} content={partner.website} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.headName} content={partner.headName} />
          </Grid>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.headTitle} content={partner.headTitle} />
          </Grid>
          <Grid xs={4} item>
            <ItemColumnCell label={messages.headEmail} content={partner.headEmail} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid xs={12} item>
            <ItemColumnCell label={messages.languages} content={partner.languages} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid xs={12} item>
            <ItemDynamicCell items={partner.sectors} classes={classes} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>);
  }

  return (<PaddedContent big>
    <div className={classes.alignText}>{messages.no_data}</div>
  </PaddedContent>);
};

PartnerProfileDetailItem.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileDetailItem);
