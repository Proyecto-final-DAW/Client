import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../context/hooks/useAuth';
import { userInfoRepository, userRepository } from '../adapter';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const normalizedName = name.trim();
      const normalizedEmail = email.trim();

      await userRepository.register(normalizedName, normalizedEmail, password);
      const { token, user } = await userInfoRepository.login(
        normalizedEmail,
        password
      );

      setSession(token, user);
      navigate(user.onboarding_completed ? '/dashboard' : '/onboarding', {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setClientError(null);

    if (!name.trim()) {
      setClientError('INGRESA TU NOMBRE');
      return;
    }
    if (!email.trim()) {
      setClientError('INGRESA TU EMAIL');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setClientError('EMAIL INVALIDO');
      return;
    }
    if (!password) {
      setClientError('INGRESA TU PASSWORD');
      return;
    }
    if (password.length < 8) {
      setClientError('PASSWORD MINIMO 8 CARACTERES');
      return;
    }

    void handleSubmit();
  };

  const displayError = clientError ?? error;

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    displayError,
    loading,
    onSubmit,
  };
};
