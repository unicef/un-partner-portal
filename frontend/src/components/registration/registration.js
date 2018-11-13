import React from 'react';
import Button from 'material-ui/Button';
import Card from '../common/card';
import Stepper from './stepper';
import { browserHistory as history } from 'react-router';

const messages = {
  title: 'Registration Organization',
  signOut: 'Sign out',
};

const Registration = () => (
  <div>
    <Button
      style={{ marginTop: '15px', right: '15px', position: 'fixed' }}
      color="accent"
      raised
      onClick={() => {
        window.localStorage.removeItem('token');
        history.push('/login');
      }}>{messages.signOut}</Button>
    <Card title={messages.title}>
      <Stepper />
    </Card>
  </div >
);


export default Registration;
