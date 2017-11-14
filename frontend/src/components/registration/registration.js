import React from 'react';

import Card from '../common/card';
import Stepper from './stepper';

const messages = {
  title: 'Registration Organization',
};

const Registration = () => (
  <Card title={messages.title}>
    <Stepper />
  </Card>
);


export default Registration;
