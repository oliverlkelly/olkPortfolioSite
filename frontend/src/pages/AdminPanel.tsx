import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth, adminApi } from '@/hooks/useAdmin';
import styles from './AdminPanel.module.css';

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, error, loading }: {
  onLogin: (pw: string) => void;
  error: string;
  loading: boolean;
}) {
  const [pw, setPw] = useState('');
  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>⚙</div>
        <h1 className={styles.loginTitle}>Admin</h1>
        <p className={styles.loginSub}>Portfolio management</p>
        <form
          className={styles.loginForm}
          onSubmit={(e) => { e.preventDefault(); onLogin(pw); }}
        >
          <input
            type="password"
            className={styles.loginInput}
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          {error && <p className={styles.loginError}>{error}</p>}
          <button className={styles.loginBtn} disabled={loading}>
            {loading ? 'Verifying…' : 'Sign in →'}
          </button>
        </form>
        <a href="/" className={styles.loginBack}>← Back to portfolio</a>
      </div>
    </div>
  );
}

// ─── Confirm delete dialog ────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p className={styles.dialogMsg}>{message}</p>
        <div className={styles.dialogBtns}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Generic list table ───────────────────────────────────────────────────────
function EntityTable({ rows, columns, onEdit, onDelete }: {
  rows:    Record<string, unknown>[];
  columns: { key: string; label: string; render?: (v: unknown) => string }[];
  onEdit:   (row: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  return (
    <>
      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this item? This cannot be undone."
          onConfirm={() => { onDelete(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className={styles.empty}>No records yet</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id as string}>
                {columns.map((c) => (
                  <td key={c.key} className={styles.td}>
                    {c.render
                      ? c.render(row[c.key])
                      : String(row[c.key] ?? '—')}
                  </td>
                ))}
                <td className={styles.tdActions}>
                  <button className={styles.editBtn}   onClick={() => onEdit(row)}>Edit</button>
                  <button className={styles.deleteBtnSm} onClick={() => setConfirmId(row.id as string)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Generic field editor ─────────────────────────────────────────────────────
function FormField({ label, name, value, type = 'text', onChange, hint }: {
  label: string; name: string; value: string;
  type?: 'text' | 'textarea' | 'date' | 'checkbox' | 'array';
  onChange: (name: string, value: string | boolean | string[]) => void;
  hint?: string;
}) {
  if (type === 'checkbox') {
    return (
      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={(e) => onChange(name, e.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }
  if (type === 'array') {
    return (
      <div className={styles.formField}>
        <label className={styles.formLabel}>{label}</label>
        {hint && <p className={styles.formHint}>{hint}</p>}
        <textarea
          className={styles.formInput}
          rows={3}
          value={value}
          onChange={(e) => onChange(name, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          placeholder="One item per line"
        />
      </div>
    );
  }
  if (type === 'textarea') {
    return (
      <div className={styles.formField}>
        <label className={styles.formLabel}>{label}</label>
        <textarea className={styles.formInput} rows={4} value={value}
          onChange={(e) => onChange(name, e.target.value)} />
      </div>
    );
  }
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>{label}</label>
      <input type={type} className={styles.formInput} value={value}
        onChange={(e) => onChange(name, e.target.value)} />
    </div>
  );
}

// ─── Projects tab ─────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [rows, setRows]       = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = useCallback(async () => {
    try { setRows((await adminApi.getProjects()) as Record<string, unknown>[]); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = (): Record<string, unknown> => ({
    title: '', description: '', long_description: '', tech_stack: [],
    github_url: '', live_url: '', featured: false,
    display_order: 0, start_date: '', end_date: '',
  });

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editing?.id) await adminApi.updateProject(editing.id as string, editing);
      else             await adminApi.createProject(editing);
      setMsg('Saved ✓'); setEditing(null); await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error saving');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    try { await adminApi.deleteProject(id); await load(); } catch {}
  };

  const set = (k: string, v: unknown) => setEditing((p) => ({ ...p!, [k]: v }));

  const COLS = [
    { key: 'title',        label: 'Title' },
    { key: 'featured',     label: 'Featured', render: (v: unknown) => v ? '★' : '' },
    { key: 'display_order', label: 'Order' },
    { key: 'start_date',   label: 'Start', render: (v: unknown) => v ? new Date(v as string).getFullYear().toString() : '—' },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Projects</h2>
        <button className={styles.addBtn} onClick={() => setEditing(blank())}>+ Add Project</button>
      </div>
      {msg && <p className={styles.successMsg}>{msg}</p>}
      <EntityTable rows={rows} columns={COLS} onEdit={setEditing} onDelete={del} />

      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.drawerTitle}>{editing.id ? 'Edit' : 'New'} Project</h3>
            <div className={styles.formGrid}>
              <FormField label="Title"            name="title"            value={String(editing.title ?? '')}            onChange={set} />
              <FormField label="Display order"    name="display_order"    value={String(editing.display_order ?? 0)}     onChange={set} type="text" />
              <FormField label="Description"      name="description"      value={String(editing.description ?? '')}      onChange={set} type="textarea" />
              <FormField label="Long description" name="long_description" value={String(editing.long_description ?? '')} onChange={set} type="textarea" />
              <FormField label="Tech stack"       name="tech_stack"       value={(editing.tech_stack as string[] ?? []).join('\n')} onChange={set} type="array" hint="One technology per line" />
              <FormField label="GitHub URL"       name="github_url"       value={String(editing.github_url ?? '')}       onChange={set} />
              <FormField label="Live URL"         name="live_url"         value={String(editing.live_url ?? '')}         onChange={set} />
              <FormField label="Start date"       name="start_date"       value={String(editing.start_date ?? '')}       onChange={set} type="date" />
              <FormField label="End date"         name="end_date"         value={String(editing.end_date ?? '')}         onChange={set} type="date" />
              <FormField label="Featured"         name="featured"         value={String(editing.featured ?? false)}      onChange={set} type="checkbox" />
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Experience tab ───────────────────────────────────────────────────────────
function ExperienceTab() {
  const [rows, setRows]       = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = useCallback(async () => {
    try { setRows((await adminApi.getExperience()) as Record<string, unknown>[]); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = (): Record<string, unknown> => ({
    company: '', role: '', location: '', employment_type: 'Full-time',
    description: '', achievements: [], tech_stack: [],
    start_date: '', end_date: '', is_current: false,
    company_url: '', display_order: 0,
  });

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editing?.id) await adminApi.updateExp(editing.id as string, editing);
      else             await adminApi.createExp(editing);
      setMsg('Saved ✓'); setEditing(null); await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error saving');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    try { await adminApi.deleteExp(id); await load(); } catch {}
  };

  const set = (k: string, v: unknown) => setEditing((p) => ({ ...p!, [k]: v }));

  const COLS = [
    { key: 'company',      label: 'Company' },
    { key: 'role',         label: 'Role' },
    { key: 'is_current',   label: 'Current', render: (v: unknown) => v ? '●' : '' },
    { key: 'start_date',   label: 'From', render: (v: unknown) => v ? new Date(v as string).getFullYear().toString() : '—' },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Experience</h2>
        <button className={styles.addBtn} onClick={() => setEditing(blank())}>+ Add Role</button>
      </div>
      {msg && <p className={styles.successMsg}>{msg}</p>}
      <EntityTable rows={rows} columns={COLS} onEdit={setEditing} onDelete={del} />

      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.drawerTitle}>{editing.id ? 'Edit' : 'New'} Role</h3>
            <div className={styles.formGrid}>
              <FormField label="Company"         name="company"         value={String(editing.company ?? '')}         onChange={set} />
              <FormField label="Role"            name="role"            value={String(editing.role ?? '')}            onChange={set} />
              <FormField label="Location"        name="location"        value={String(editing.location ?? '')}        onChange={set} />
              <FormField label="Employment type" name="employment_type" value={String(editing.employment_type ?? '')} onChange={set} />
              <FormField label="Description"     name="description"     value={String(editing.description ?? '')}     onChange={set} type="textarea" />
              <FormField label="Achievements"    name="achievements"    value={(editing.achievements as string[] ?? []).join('\n')} onChange={set} type="array" hint="One achievement per line" />
              <FormField label="Tech stack"      name="tech_stack"      value={(editing.tech_stack as string[] ?? []).join('\n')}  onChange={set} type="array" hint="One technology per line" />
              <FormField label="Company URL"     name="company_url"     value={String(editing.company_url ?? '')}     onChange={set} />
              <FormField label="Start date"      name="start_date"      value={String(editing.start_date ?? '')}      onChange={set} type="date" />
              <FormField label="End date"        name="end_date"        value={String(editing.end_date ?? '')}        onChange={set} type="date" />
              <FormField label="Currently here"  name="is_current"      value={String(editing.is_current ?? false)}   onChange={set} type="checkbox" />
              <FormField label="Display order"   name="display_order"   value={String(editing.display_order ?? 0)}    onChange={set} />
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Education tab ────────────────────────────────────────────────────────────
function EducationTab() {
  const [rows, setRows]       = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = useCallback(async () => {
    try { setRows((await adminApi.getEducation()) as Record<string, unknown>[]); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = (): Record<string, unknown> => ({
    institution: '', degree: '', field_of_study: '', location: '',
    description: '', achievements: [], grade: '',
    start_date: '', end_date: '', is_current: false,
    institution_url: '', display_order: 0,
  });

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editing?.id) await adminApi.updateEdu(editing.id as string, editing);
      else             await adminApi.createEdu(editing);
      setMsg('Saved ✓'); setEditing(null); await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error saving');
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    try { await adminApi.deleteEdu(id); await load(); } catch {}
  };

  const set = (k: string, v: unknown) => setEditing((p) => ({ ...p!, [k]: v }));

  const COLS = [
    { key: 'institution',  label: 'Institution' },
    { key: 'degree',       label: 'Degree' },
    { key: 'start_date',   label: 'From', render: (v: unknown) => v ? new Date(v as string).getFullYear().toString() : '—' },
    { key: 'grade',        label: 'Grade' },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2 className={styles.tabTitle}>Education</h2>
        <button className={styles.addBtn} onClick={() => setEditing(blank())}>+ Add Entry</button>
      </div>
      {msg && <p className={styles.successMsg}>{msg}</p>}
      <EntityTable rows={rows} columns={COLS} onEdit={setEditing} onDelete={del} />

      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.drawerTitle}>{editing.id ? 'Edit' : 'New'} Education</h3>
            <div className={styles.formGrid}>
              <FormField label="Institution"    name="institution"    value={String(editing.institution ?? '')}    onChange={set} />
              <FormField label="Degree"         name="degree"         value={String(editing.degree ?? '')}         onChange={set} />
              <FormField label="Field of study" name="field_of_study" value={String(editing.field_of_study ?? '')} onChange={set} />
              <FormField label="Location"       name="location"       value={String(editing.location ?? '')}       onChange={set} />
              <FormField label="Description"    name="description"    value={String(editing.description ?? '')}    onChange={set} type="textarea" />
              <FormField label="Achievements"   name="achievements"   value={(editing.achievements as string[] ?? []).join('\n')} onChange={set} type="array" hint="One achievement per line" />
              <FormField label="Grade / Result" name="grade"          value={String(editing.grade ?? '')}          onChange={set} />
              <FormField label="Institution URL" name="institution_url" value={String(editing.institution_url ?? '')} onChange={set} />
              <FormField label="Start date"     name="start_date"     value={String(editing.start_date ?? '')}     onChange={set} type="date" />
              <FormField label="End date"       name="end_date"       value={String(editing.end_date ?? '')}       onChange={set} type="date" />
              <FormField label="Currently here" name="is_current"     value={String(editing.is_current ?? false)}  onChange={set} type="checkbox" />
              <FormField label="Display order"  name="display_order"  value={String(editing.display_order ?? 0)}   onChange={set} />
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main admin panel ─────────────────────────────────────────────────────────
type Tab = 'projects' | 'experience' | 'education';

export function AdminPanel() {
  const { authed, login, logout, error, loading } = useAdminAuth();
  const [tab, setTab] = useState<Tab>('projects');

  if (!authed) {
    return <LoginScreen onLogin={login} error={error} loading={loading} />;
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <span className={styles.sidebarLogo}>⚙ Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          {(['projects', 'experience', 'education'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.navItem} ${tab === t ? styles.navActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <a href="/" className={styles.viewSiteLink}>← View site</a>
          <button className={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {tab === 'projects'   && <ProjectsTab />}
        {tab === 'experience' && <ExperienceTab />}
        {tab === 'education'  && <EducationTab />}
      </main>
    </div>
  );
}
