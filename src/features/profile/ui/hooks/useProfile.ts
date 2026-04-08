import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../context/hooks/useAuth';
import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';
import { profileRepository } from '../adapter';

export const useProfile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const successTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const data = await profileRepository.getProfile(token);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!token) return;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updated = await profileRepository.updateProfile(token, data);
      setProfile((prev) => (prev ? { ...prev, ...updated } : null));
      setUpdateSuccess(true);
      successTimerRef.current = setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : 'Error al actualizar'
      );
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    if (!token) return;
    setChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await profileRepository.changePassword(token, data);
      setPasswordSuccess(true);
      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Error al cambiar contrasena'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updating,
    updateError,
    updateSuccess,
    changePassword,
    changingPassword,
    passwordError,
    passwordSuccess,
  };
};
