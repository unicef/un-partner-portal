import React from 'react';

import Card from '../common/card';

import LoginForm from './loginForm';

const messages = {
  title: 'Login',
};

const Registration = () => (
  <Card title={messages.title}>
    <LoginForm />
  </Card>
);


export default Registration;
