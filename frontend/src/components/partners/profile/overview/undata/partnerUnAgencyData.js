import R from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Tabs from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import LocalPaginatedList from '../../../../common/list/localPaginatedList';
import { getPartnerUnData } from '../../../../../reducers/partnerUnData';
import PaddedContent from '../../../../common/paddedContent';
import CustomTab from '../../../../common/customTab';
import Loader from '../../../../common/loader';

const messages = {
  info: 'Vendor Number/Partner ID not provided by agency.',
  empty: 'There is no data to display.',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 4;

  return {
    center: {
      padding: `${padding}px`,
      display: 'flex',
      justifyContent: 'center',
    },
  };
};

const renderCells = ({ row, column, value }) => <TableCell>{value}</TableCell>;

/* eslint-disable react/prefer-stateless-function */
class PartnerUnAgencyData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.loadAgencyData();
  }


  handleChange(event, index) {
    this.setState({ index });
  }

  render() {
    const { loading, tables, error, classes } = this.props;
    const { index } = this.state;

    return (
      tables ? <React.Fragment>
        <Tabs
          scrollable
          scrollButtons="off"
          textColor="accent"
          indicatorColor="accent"
          value={index}
          onChange={this.handleChange}
        >
          {tables.map((tab, i) => (
            <CustomTab label={tables[i].title} key={i} />
          ))}
        </Tabs>
        <PaddedContent>
          <Paper>
            <LocalPaginatedList
              loading={loading}
              items={tables[index].items}
              itemsCount={tables[index].itemsCount}
              columns={tables[index].columns}
              templateCell={renderCells}
            />
          </Paper>
        </PaddedContent>
      </React.Fragment>
        : <PaddedContent>
          <Loader loading={loading} replaceContent>
            {R.path(['response', 'status'], error) === 404
              ? <Typography className={classes.center} type="body2">{messages.info}</Typography>
              : <Typography className={classes.center} type="body2">{messages.empty}</Typography>}
          </Loader>
        </PaddedContent>
    );
  }
}

PartnerUnAgencyData.propTypes = {
  classes: PropTypes.object,
  error: PropTypes.object,
  loadAgencyData: PropTypes.func,
  tables: PropTypes.array,
  loading: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  tables: state.partnerUnData.data[ownProps.agencyId],
  error: state.partnerUnData.data.error[ownProps.agencyId],
  loading: state.partnerUnData.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadAgencyData: () => dispatch(getPartnerUnData(ownProps.agencyId, ownProps.params.id)),
});

export default R.compose(
  withStyles(styleSheet, { name: 'PartnerUnAgencyData' }),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PartnerUnAgencyData);
