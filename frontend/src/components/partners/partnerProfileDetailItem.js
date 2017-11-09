import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ItemColumnCell from '../common/cell/itemColumnCell';
import GridColumn from '../common/grid/gridColumn';
import GridRow from '../common/grid/gridRow';
import ItemWorkingLanguagesCell from '../common/cell/itemWorkingLanguagesCell';
import ItemSectorsCell from '../common/cell/itemSectorsCell';
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

const styleSheet = (theme) => {
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
};

const PartnerProfileDetailItem = (props) => {
  const { classes, partner } = props;

  if (partner) {
    return (
      <GridColumn className={classes.container}>
        <GridRow columns={3} spacing={24}>
          <ItemColumnCell label={messages.mailing} content={R.path(['mailing_address', 'org_email'], partner)} />
          <ItemColumnCell label={messages.phone} content={R.path(['mailing_address', 'telephone'], partner)} />
          <ItemColumnCell label={messages.website} content={R.path(['mailing_address', 'website'], partner)} />
        </GridRow>
        <GridRow columns={3} spacing={24}>
          <ItemColumnCell label={messages.headName} content={R.path(['org_head', 'first_name'], partner)} />
          <ItemColumnCell label={messages.headTitle} content={R.path(['org_head', 'job_title'], partner)} />
          <ItemColumnCell label={messages.headEmail} content={R.path(['org_head', 'email'], partner)} />
        </GridRow>
        <GridRow columns={1} spacing={24}>
          <ItemWorkingLanguagesCell label={messages.languages} content={partner.working_languages} />
        </GridRow>
        <GridRow columns={1} spacing={24}>
          <ItemSectorsCell label={messages.specialisation} content={partner.experiences} />
        </GridRow>
      </GridColumn>
    );
  }

  return (<PaddedContent big>
    <div className={classes.alignText}>{messages.no_data}</div>
  </PaddedContent>);
};

PartnerProfileDetailItem.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'PartnerProfileDetailItem' })(PartnerProfileDetailItem);
