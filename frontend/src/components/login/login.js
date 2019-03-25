import React from 'react';
import Card from '../common/cardLogin';
import LoginForm from './loginForm';

const messages = {
  title: 'UN Partner Portal',
};

const Login = () => (
  <Card title={messages.title}>
    <LoginForm />
  </Card>
);

export default Login;
