import Button from '@/components/button';
import { EventCategory, EventName } from '@/constants/event';
import { authStyles } from './styles';
import React, { useState, FormEvent } from 'react';
import ReactGA from 'react-ga4';

type EmailAuthFormProps = {
  onBack: () => void;
  onSuccess: () => void;
};

export function EmailAuthForm({ onBack, onSuccess }: EmailAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      ReactGA.event({ category: EventCategory.Global, action: EventName.LoginSuccess });
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      ReactGA.event({ category: EventCategory.Global, action: EventName.LoginFailed });
    } finally {
      setLoading(false);
    }
  };

  
  const handleButtonClick = () => {
    
    const syntheticEvent = { preventDefault: () => {} } as FormEvent;
    handleSubmit(syntheticEvent);
  };

  return (
    <div className={authStyles.container}>
      <h4 className={authStyles.title}>Email Authentication</h4>
      <form onSubmit={handleSubmit} className={authStyles.formContainer}>
        <input
          type="email"
          placeholder="Email"
          className={authStyles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={authStyles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className={authStyles.errorText}>{error}</div>}
        <Button
          type="bordered"
          className={authStyles.primaryButton}
          disabled={loading || !email || !password}
          onClick={handleButtonClick} // Now matches the expected type
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <button
          type="button"
          className={authStyles.secondaryButton}
          onClick={onBack}
        >
          ← Back to wallet connection
        </button>
      </form>
    </div>
  );
}