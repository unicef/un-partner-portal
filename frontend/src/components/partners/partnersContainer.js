import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import PartnerFilter from './partnerFilter';
import PartnersList from './partnersList';

const messages = {
  header: 'Partners',
};

class PartnersContainer extends Component {
  onRowClick(row) {
    // todo navigate to detail page
  }

  render() {
    const { partners, columns } = this.props;

    return (
      <div>
        <Grid item>
          <HeaderNavigation title={messages.header} />
        </Grid>
        <MainContentWrapper>
          <Grid container direction="column" gutter={24}>
            <Grid item>
              <PartnerFilter />
            </Grid>
            <Grid item>
              <PartnersList
                items={partners}
                columns={columns}
                onRowClick={(row) => { this.onRowClick(row); }}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </div>
    );
  }
}

PartnersContainer.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.agencyPartnersList.partners,
  columns: state.agencyPartnersList.columns,
});


export default connect(mapStateToProps, null)(PartnersContainer);
