import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../components/common//mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import GridColumn from '../../components/common/grid/gridColumn';
import HeaderList from '../../components/common/list/headerList';

const messages = {
  header: 'Dashboard',
  yourRole: 'Your role',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  const paddingMedium = theme.spacing.unit * 2;

  return {
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    icon: {
      fill: '#FF0000',
      width: 20,
      height: 20,
    },
    hqProfile: {
      width: '100%',
      margin: '0',
      padding: `${paddingMedium}px 0 ${paddingMedium}px ${padding}px`,
    },
    countryItem: {
      width: '100%',
      margin: '0',
      padding: `${paddingMedium}px 0 ${paddingMedium}px ${padding}px`,
    },
  };
};

class YourRole extends Component {
  componentWillMount() {
  }

  /* eslint-disable class-methods-use-this */
  header() {
    return (
      <Grid alignItems="center" container>
        <Grid xs={12} item><Typography type="headline" color="inherit">
          {messages.yourRole}
        </Typography>
        </Grid>
      </Grid>);
  }

  role() {
    const { classes, name } = this.props;

    return (<Grid
      alignItems="center"
      container
      className={classes.countryItem}
    >
      <Grid item xs={8}>
        <Typography type={'subheading'} color="inherit">
          {name}
        </Typography>
      </Grid>

      <Grid item xs={4}>
        <Typography type="caption">
          {'HQ Administrator'}
        </Typography>
      </Grid>
    </Grid>);
  }

  render() {
    return (
      <React.Fragment>
        <HeaderNavigation title={messages.header}>
          <MainContentWrapper>
            <GridColumn spacing={40}>
              <HeaderList
                header={this.header()}
              >
                {this.role()}
              </HeaderList>
            </GridColumn>
          </MainContentWrapper>
        </HeaderNavigation>
      </React.Fragment>
    );
  }
}

YourRole.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
};

const mapStateToProps = state => ({
  name: state.session.partnerName || state.session.agencyName,
});

const connectedYourRole = connect(mapStateToProps, null)(YourRole);
const routerYourRole = withRouter(connectedYourRole);
export default withStyles(styleSheet, { name: 'partnerApplicationsFilter' })(routerYourRole);
