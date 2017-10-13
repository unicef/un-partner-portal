import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../../common/grid/gridColumn';
import Reviews from './reviews';

const ReviewContent = (props) => {
  const { applicationId } = props;
  return (
    <GridColumn>
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <Reviews applicationId={applicationId} />
        </Grid>
        <Grid item xs={12} sm={4}>

        </Grid>
      </Grid>
      <Divider />
    </GridColumn>
  );
};


const mapStateToProps = (state, ownProps) => ({

});

export default connect(mapStateToProps)(ReviewContent);
