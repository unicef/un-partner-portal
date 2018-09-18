import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
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
import { selectNormalizedNotificationsFrequencies } from '../../store';
import { updateProfile } from '../../reducers/updateUserProfile';
import { errorToBeAdded } from '../../reducers/errorReducer';


const messages = {
  header: 'User Profile',
  name: 'Full Name',
  email: 'E-mail',
  officeName: 'Office Name',
  officeRole: 'Office Role',
  telephone: 'Telephone',
  permissions: 'Permissions',
  notifications: 'Frequency of Notifications',
  save: 'Save',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 3;

  return {
    button: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    dividerPadding: {
      margin: `${padding}px 0px ${padding}px 0px`,
    },
  };
};

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.onUpdateProfile = this.onUpdateProfile.bind(this);
  }

  onUpdateProfile(values) {
    const { updateUserProfile, postMessage } = this.props;
    const notification_frequency = values.notificationsFrequency === '0_disabled' ? '' : values.notificationsFrequency;

    updateUserProfile({ notification_frequency })
      .then(postMessage('userProfileUpdate', 'User profile updated.'));
  }

  render() {
    const { handleSubmit, classes, notifications } = this.props;

    return (
      <React.Fragment>
        <HeaderNavigation
          title={messages.header}

          header={<Button
            color="accent"
            raised
            onTouchTap={handleSubmit(this.onUpdateProfile)}
          >{messages.save}
          </Button>}
        >
          <MainContentWrapper>
            <GridColumn spacing={40}>
              <HeaderList >
                <PaddedContent>
                  <form onSubmit={handleSubmit(this.onUpdateProfile)}>
                    <Grid container direction="row">
                      <Grid item sm={4} xs={12}>
                        <SelectForm
                          label={messages.notifications}
                          fieldName="notificationsFrequency"
                          values={notifications}
                          required
                        />
                      </Grid>
                    </Grid>
                    <Divider className={classes.dividerPadding} />
                    <Grid item xs={12}>
                      <Grid container direction="row">
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
                      <Divider className={classes.dividerPadding} />
                      <Grid container direction="row">
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
  notifications: PropTypes.array,
  handleSubmit: PropTypes.func,
  updateUserProfile: PropTypes.func,
  postMessage: PropTypes.func,
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
  notifications: selectNormalizedNotificationsFrequencies(state),

  initialValues: {
    name: state.session.name,
    email: state.session.email,
    role: state.session.position || state.session.officeRole,
    officeName: state.session.officeName || state.session.partnerName,
    telephone: state.session.telephone,
    permissions: state.session.permissions.join(', \n'),
    notificationsFrequency: R.isEmpty(state.session.notificationFrequency) ? '0_disabled' : state.session.notificationFrequency,
  },
});

const mapDispatchToProps = dispatch => ({
  updateUserProfile: payload => dispatch(updateProfile(payload)),
  postMessage: (error, message) => dispatch(errorToBeAdded(error, 'userProfile', message)),
});

const connectedUserProfile = connect(mapStateToProps, mapDispatchToProps)(formUserProfile);
const routerUserProfile = withRouter(connectedUserProfile);
export default withStyles(styleSheet, { name: 'userProfile' })(routerUserProfile);
