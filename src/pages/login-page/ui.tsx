import { JSX } from 'react';

import { LoginForm } from '~/features';

export const LoginPage = (): JSX.Element => (
  <div className="container" style={{ maxWidth: '400px', marginTop: '5rem' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h1>Anmelden</h1>
      <p>Bitte melden Sie sich mit Ihren Zugangsdaten an</p>
    </div>

    <LoginForm />
  </div>
);
