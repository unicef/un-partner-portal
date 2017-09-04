import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import PartnersList from './partnersList';

const messages = {
  header: 'Partners',
};

const PartnersContainer = (props) => {
  const { partners, columns } = props;

  return (<div>
    <Grid item>
      <HeaderNavigation title={messages.header} />
    </Grid>
    <MainContentWrapper>
      <Grid container direction="column" gutter={40}>
        <Grid item>
          <PartnersList
            items={partners}
            columns={columns}
          />
        </Grid>
      </Grid>
    </MainContentWrapper>
  </div>
  );
};


PartnersContainer.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.agencyPartnersList.partners,
  columns: state.agencyPartnersList.columns,
});


export default connect(mapStateToProps, null)(PartnersContainer);
