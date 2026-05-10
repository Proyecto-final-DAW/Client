import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { STORAGE_KEY_LAST_EMAIL } from '@context/AuthProvider';
import { useAuth } from '@context/hooks/useAuth';
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
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error. Intentalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);
    // Only gate on missing fields and an obviously-malformed email
    // here. Any other password the user types is sent to the server,
    // which is the only thing that can tell "wrong password" from
    // "right password" — including a 7-char typo of an 8-char real
    // password. The previous `password.length < 8` check showed
    // "PASSWORD MINIMO 8 CARACTERES" on a typo, which was wrong
    // (the password isn't too short, it's incorrect). The 8-char
    // floor lives at REGISTER time (auth.ts validator) where it's a
    // real requirement.
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
