import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '~/app/providers';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Bitte geben Sie E-Mail und Passwort ein.');
      return;
    }

    // Einfache E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@beispiel.de"
          disabled={isLoading}
        />
      </div>

      <div className="form-control">
        <label htmlFor="password">Passwort</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginTop: '1.5rem' }}>
        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? 'Anmelden...' : 'Anmelden'}
        </Button>
      </div>
    </form>
  );
};
