import styled, { DefaultTheme } from 'styled-components';

// Defina a interface do seu tema
interface AppTheme extends DefaultTheme {
  colors: {
    white: string;
    gray300: string;
    gray600: string;
    gray800: string;
    blue200: string;
    blue400: string;
    blue500: string;
    blue600: string;
    blue700: string;
    red400: string;
    red500: string;
    green400: string;
    green500: string;
  };
  dark: boolean;
}

// Componentes com tipagem adequada
export const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 1rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h2<{ theme: AppTheme }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1.5rem;
`;

export const Input = styled.input<{ theme: AppTheme }>`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.white};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue500};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.blue200};
  }

  ${({ theme }) => theme.dark && `
    border-color: ${theme.colors.gray600};
    background: ${theme.colors.gray800};
  `}
`;

interface FeedbackTextProps {
  $error?: boolean;
  theme: AppTheme;
}

export const FeedbackText = styled.div<FeedbackTextProps>`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: ${({ $error, theme }) => 
    $error ? theme.colors.red500 : theme.colors.green500};

  ${({ theme }) => theme.dark && `
    color: ${({ $error }: FeedbackTextProps) => 
      $error ? theme.colors.red400 : theme.colors.green400};
  `}
`;

export const SubmitButton = styled.button<{ theme: AppTheme }>`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.blue600};
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue700};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BackButton = styled.button<{ theme: AppTheme }>`
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue600};
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }

  ${({ theme }) => theme.dark && `
    color: ${theme.colors.blue400};
  `}
`;