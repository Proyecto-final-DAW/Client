import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@context/hooks/useAuth';
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

  const successTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const data = await profileRepository.getProfile();
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

  /**
   * Returns true on success so the caller can close the edit form on
   * a clean save and keep it open on error. Errors are still surfaced
   * via `updateError` for inline messaging — the boolean is just the
   * "should I leave edit mode?" signal that the caller couldn't read
   * before from the awaited promise alone.
   */
  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!token) return false;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updated = await profileRepository.updateProfile(data);
      setProfile((prev) => (prev ? { ...prev, ...updated } : null));
      setUpdateSuccess(true);
      successTimerRef.current = setTimeout(() => setUpdateSuccess(false), 3000);
      return true;
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : 'Error al actualizar'
      );
      return false;
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
      await profileRepository.changePassword(data);
      setPasswordSuccess(true);
      setTimeout(() => {
        logout();
        navigate('/', { replace: true });
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
