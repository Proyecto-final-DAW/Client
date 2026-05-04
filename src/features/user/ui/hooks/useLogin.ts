import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { STORAGE_KEY_LAST_EMAIL } from '../../../../context/AuthProvider';
import { useAuth } from '../../../../context/hooks/useAuth';
import { userInfoRepository } from '../adapter';

export const useLogin = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Explicit redirect (e.g. registration → login) wins over the remembered
    // email so a brand-new sign-up doesn't get a previous user's address.
    const prefillEmail = (location.state as { email?: string } | null)?.email;
    if (prefillEmail) {
      setEmail(prefillEmail);
      return;
    }
    const remembered = localStorage.getItem(STORAGE_KEY_LAST_EMAIL);
    if (remembered) setEmail(remembered);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await userInfoRepository.login(email, password);
      setSession(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);
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
    void handleSubmit(e);
  };

  const displayError = clientError ?? error;

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    clientError,
    displayError,
    loading,
    onSubmit,
  };
};
