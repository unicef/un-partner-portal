import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../common/grid/gridColumn';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import PartnerOverviewFlagMenu from './partnerOverviewFlagMenu';

const messages = {
  flagStatus: 'Flag status',
  updated: 'Last updated: ',
  none: 'None',
}; 

const flags = () => (
  <PaddedContent>
    <GridColumn />
  </PaddedContent>
);

const none = () => (
  <PaddedContent big>
    {messages.none}
  </PaddedContent>);

const flagHeader = () => (
  <Grid container align="center" justify="space-between" direction="row">
    <Grid item xs={10}>
      <Typography type="title" >{messages.flagStatus}</Typography>
    </Grid>
    <Grid item xs={2}>
      <PartnerOverviewFlagMenu />
    </Grid>
  </Grid>);

const PartnerOverviewFlag = (props) => {
  const { partner, flagItems } = props;

  return (
    <div>
      <HeaderList
        headerObject={flagHeader(partner.lastUpdate)}
        rows={flagItems ? flags() : [none()]}
      />
    </div>);
};


PartnerOverviewFlag.propTypes = {
  partner: PropTypes.object.isRequired,
  flagItems: PropTypes.array,
};

export default PartnerOverviewFlag;
