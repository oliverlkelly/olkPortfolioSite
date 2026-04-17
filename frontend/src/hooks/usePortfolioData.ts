import { useState, useEffect } from 'react';
import type { PortfolioData, Profile, Project, Experience, Education } from '@/types';

const API_BASE = '/api';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  const json = await res.json();
  return json.data as T;
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    projects: [],
    experience: [],
    education: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [profile, projects, experience, education] = await Promise.all([
          fetchJson<Profile>('/profile'),
          fetchJson<Project[]>('/projects'),
          fetchJson<Experience[]>('/experience'),
          fetchJson<Education[]>('/education'),
        ]);
        setData({ profile, projects, experience, education });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}
