import React from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Card from '../common/card';
import Stepper from './stepper';

const messages = {
  title: 'Registration Organization',
  signOut: 'Sign out',
};

const Registration = (props) => {
  const { logoutAzure } = props;

  return (<div>
    <Button
      style={{ marginTop: '15px', right: '15px', position: 'fixed' }}
      color="accent"
      raised
      onClick={() => {
        window.localStorage.removeItem('token');
        window.location.href = logoutAzure;
      }}>{messages.signOut}</Button>
    <Card title={messages.title}>
      <Stepper />
    </Card>
  </div >)
};

Registration.propTypes = {
  logoutAzure: PropTypes.string,
};

const mapStateToProps = state => ({
  logoutAzure: state.partnerProfileConfig['active-directory-logout-url'],
});

export default connect(mapStateToProps)(Registration);
