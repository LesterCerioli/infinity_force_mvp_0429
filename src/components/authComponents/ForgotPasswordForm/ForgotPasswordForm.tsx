import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import {
  ForgotPasswordContainer,
  FormContainer,
  Title,
  Input,
  FeedbackText,
  SubmitButton,
  BackButton
} from './styles';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setMessage('Password reset link has been sent to your email');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <Title>Reset Your Password</Title>
      
      <FormContainer as="form" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          aria-label="Email address"
        />
        
        {message && (
          <FeedbackText>
            {message}
          </FeedbackText>
        )}
        
        {error && (
          <FeedbackText $error>
            {error}
          </FeedbackText>
        )}
        
        <SubmitButton
          type="submit"
          disabled={loading || !email.trim()}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </SubmitButton>
        
        <BackButton
          type="button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to Login
        </BackButton>
      </FormContainer>
    </ForgotPasswordContainer>
  );
};