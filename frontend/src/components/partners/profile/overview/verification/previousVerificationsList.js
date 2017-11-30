import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import VerificationItem from './verificationItem';
import GridColumn from '../../../../common/grid/gridColumn';
import PaddedContent from '../../../../common/paddedContent';
import Pagination from '../../../../common/pagination';
import { loadPartnerVerifications } from '../../../../../reducers/partnerVerifications';


const styleSheet = theme => ({
  background: {
    backgroundColor: theme.palette.common.lightGreyBackground,
  },
});

class PreviousVerificationsList extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        page: 1,
        page_size: 5,
      },
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!equals(nextState.params, this.state.params)) {
      this.props.getVerifications(nextState.params);
      return false;
    }
    return true;
  }

  handleChangePage(event, page) {
    this.setState({ params: { ...this.state.params, page } });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ params: { ...this.state.params, page_size: event.target.value } });
  }
  render() {
    const { classes, verifications, count } = this.props;
    const { params: { page, page_size } } = this.state;
    return (
      <Grid item className={classes.background} >
        {verifications.map(verification =>
          (<GridColumn>
            <Divider />
            <PaddedContent>
              <VerificationItem verification={verification} />
            </PaddedContent>
          </GridColumn>),
        )}
        <Pagination
          count={count}
          rowsPerPage={page_size}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Grid>);
  }
}


PreviousVerificationsList.propTypes = {
  verifications: PropTypes.array,
  classes: PropTypes.object,
  getVerifications: PropTypes.func,
  count: PropTypes.string,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  getVerifications: params => dispatch(loadPartnerVerifications(ownProps.partnerId, params)),
});

export default withStyles(styleSheet,
  { name: 'PreviousVerificationsList' })(connect(null, mapDispatchToProps)(PreviousVerificationsList));
