import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  ChangePasswordData,
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';
import { profileRepository } from '../adapter';

export const useProfile = () => {
  const { token, user, logout, updateUser } = useAuth();
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

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const data = await profileRepository.getProfile();
      setProfile(data);
      // Treat the profile fetch as the canonical source of truth for
      // the user identity fields shown in the sidebar / dashboard
      // hero. When a previous client version saved a name without
      // refreshing the AuthContext, the cached login-time user kept
      // showing "Blue" forever. This re-sync runs every mount of the
      // profile page and updates the context iff something visible
      // actually changed — quiet no-op when there's nothing to fix.
      if (user) {
        const visibleChanged =
          user.name !== data.name || user.email !== data.email;
        if (visibleChanged) {
          updateUser({
            ...user,
            name: data.name,
            email: data.email,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
    // `user` and `updateUser` are intentionally excluded from deps:
    // including them would re-fetch on every AuthContext update we
    // ourselves trigger, looping. The closure captures the latest
    // values when the effect runs because `fetchProfile` is recreated
    // each render via the token dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Push the updated profile back into the AuthContext so every
      // surface that reads `user.*` (DashboardHero, sidebar, profile
      // banner) refreshes immediately. The earlier version trusted
      // the spread of `updated` to carry the new name, but the API
      // adapter casts the response to ProfileData and a missing
      // `name` field there leaves the AuthContext on its old value.
      // Belt-and-braces: explicitly take `data.name` (what we just
      // sent — guaranteed truthy when the user changed the name)
      // before falling back to `updated.name` and finally the cached
      // user. Same approach for the other fields the user can
      // actually edit so a future API quirk can't leave the UI
      // stuck on stale data.
      const merged = {
        ...(user ?? {}),
        ...updated,
      } as Parameters<typeof updateUser>[0];
      if (data.name) merged.name = data.name;
      if (data.weight !== undefined) merged.weight = data.weight;
      if (data.height !== undefined) merged.height = data.height;
      if (data.age !== undefined) merged.age = data.age;
      if (data.sex !== undefined) merged.sex = data.sex;
      if (data.activity_level !== undefined)
        merged.activity_level = data.activity_level;
      if (data.experience_level !== undefined)
        merged.experience_level = data.experience_level;
      if (data.days_per_week !== undefined)
        merged.days_per_week = data.days_per_week;
      if (data.goals !== undefined) merged.goals = data.goals;
      if (data.equipment !== undefined) merged.equipment = data.equipment;
      if (data.injuries !== undefined) merged.injuries = data.injuries;
      if (data.injury_notes !== undefined)
        merged.injury_notes = data.injury_notes;
      updateUser(merged);
      setUpdateSuccess(true);
      // Mirror the pre-clear pattern from `changePassword` so a user
      // who saves twice within 3s doesn't leak the first timer.
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
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
      // Track the timer so the unmount effect can clear it. Without
      // this, a user who navigates away within 1.5s (back button,
      // route change) still gets `logout() + navigate()` after the
      // component is gone — mutating context that the next page is
      // already rendering.
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => {
        logout();
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Error al cambiar contraseña'
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
