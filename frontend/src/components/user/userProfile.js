import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { reduxForm } from 'redux-form';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../components/common//mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import GridColumn from '../../components/common/grid/gridColumn';
import HeaderList from '../../components/common/list/headerList';
import SelectForm from '../../components/forms/selectForm';
import TextFieldForm from '../../components/forms/textFieldForm';
import PaddedContent from '../common/paddedContent';

const messages = {
  header: 'User Profile',
  name: 'Full Name',
  email: 'E-mail',
  officeName: 'Office Name',
  officeRole: 'Office Role',
  telephone: 'Telephone',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  const paddingMedium = theme.spacing.unit * 2;

  return {
    office: {
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
      background: theme.palette.primary[300],
    },
    button: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    info: {
      color: 'gray',
      fontWeight: '350',
      padding: '4px 0',
    },
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

class UserProfile extends Component {
  /* eslint-disable class-methods-use-this */
  header() {
    const { name } = this.props;

    return (
      <Grid alignItems="center" container>
        <Grid xs={12} item><Typography type="headline" color="inherit">
          {name}
        </Typography>
        </Grid>
      </Grid>);
  }

  render() {
    const { handleSubmit, classes } = this.props;

    return (
      <React.Fragment>
        <HeaderNavigation title={messages.header}>
          <MainContentWrapper>
            <GridColumn spacing={40}>
              <HeaderList >
                <PaddedContent>
                  <form onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                      <Grid container direction="row" >
                        <Grid item sm={4} xs={12}>
                          <TextFieldForm
                            label={messages.name}
                            fieldName="name"
                            readOnly
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <TextFieldForm
                            label={messages.email}
                            fieldName="email"
                            readOnly
                          />
                        </Grid>
                      </Grid>
                      <Grid container direction="row" className={classes} >
                        <Grid item sm={4} xs={12}>
                          <TextFieldForm
                            label={messages.officeName}
                            fieldName="officeName"
                            readOnly
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <TextFieldForm
                            label={messages.officeRole}
                            fieldName="role"
                            readOnly
                          />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <TextFieldForm
                            label={messages.telephone}
                            fieldName="telephone"
                            readOnly
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </PaddedContent>
              </HeaderList>
            </GridColumn>
          </MainContentWrapper>
        </HeaderNavigation>
      </React.Fragment>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  handleSubmit: PropTypes.func,
};

const formUserProfile = reduxForm({
  form: 'formUserProfile',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(UserProfile);

const mapStateToProps = state => ({
  officeRole: state.session.position || state.session.officeRole,
  name: state.session.name,

  initialValues: {
    name: state.session.name,
    email: state.session.email,
    role: state.session.position || state.session.officeRole,
    officeName: state.session.officeName,
    telephone: state.session.telephone,
  },
});

const connectedUserProfile = connect(mapStateToProps, null)(formUserProfile);
const routerUserProfile = withRouter(connectedUserProfile);
export default withStyles(styleSheet, { name: 'userProfile' })(routerUserProfile);
