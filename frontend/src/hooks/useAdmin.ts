import { useState, useCallback } from 'react';

const API = '/api/admin';

function getToken() {
  return sessionStorage.getItem('admin_token') ?? '';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  const json = await res.json() as { data: T };
  return json.data;
}

export function useAdminAuth() {
  const [authed, setAuthed]   = useState(() => !!sessionStorage.getItem('admin_token'));
  const [error,  setError]    = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (password: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ token: string }>('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      sessionStorage.setItem('admin_token', data.token);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_token');
    setAuthed(false);
  }, []);

  return { authed, login, logout, error, loading };
}

// ─── CRUD helpers ──────────────────────────────────────────────────────────────

export const adminApi = {
  // Projects
  getProjects:    ()      => apiFetch<unknown[]>('/projects', { headers: authHeaders() }),
  createProject:  (body: unknown) => apiFetch<unknown>('/projects', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  updateProject:  (id: string, body: unknown) => apiFetch<unknown>(`/projects/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }),
  deleteProject:  (id: string) => apiFetch<unknown>(`/projects/${id}`, { method: 'DELETE', headers: authHeaders() }),

  // Experience
  getExperience:  ()      => apiFetch<unknown[]>('/experience', { headers: authHeaders() }),
  createExp:      (body: unknown) => apiFetch<unknown>('/experience', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  updateExp:      (id: string, body: unknown) => apiFetch<unknown>(`/experience/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }),
  deleteExp:      (id: string) => apiFetch<unknown>(`/experience/${id}`, { method: 'DELETE', headers: authHeaders() }),

  // Education
  getEducation:   ()      => apiFetch<unknown[]>('/education', { headers: authHeaders() }),
  createEdu:      (body: unknown) => apiFetch<unknown>('/education', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  updateEdu:      (id: string, body: unknown) => apiFetch<unknown>(`/education/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }),
  deleteEdu:      (id: string) => apiFetch<unknown>(`/education/${id}`, { method: 'DELETE', headers: authHeaders() }),

  // Profile
  updateProfile:  (body: unknown) => apiFetch<unknown>('/profile', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }),
};
