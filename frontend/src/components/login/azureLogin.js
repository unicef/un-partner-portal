import React from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Card from '../common/cardLogin';
import PaddedContent from '../common/paddedContent';

const messages = {
  title: 'UN Partner Portal',
  login: 'Login via Active Directory',
  signIn: 'Sign in',
};

const AzureLogin = () => (
  <Card title={messages.title}>
    <PaddedContent>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography type="headline">{messages.login}</Typography>
        <Button
          style={{ marginTop: '25px' }}
          raised
          color="accent"
          onTouchTap={() => { window.open('/api/accounts/social-login/azuread-b2c-oauth2/', '_self'); }}
        >
          {messages.signIn}
        </Button>
      </div>
    </PaddedContent>
  </Card >
);

export default AzureLogin;
