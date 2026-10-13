/**
 * Developer / admin dashboard (route /dev). Shown only to accounts whose role has
 * `devtools.dashboard`; each section checks its own permission, and the services behind the
 * buttons check again (src/services/devtools.ts). See docs/DEVELOPER_ACCESS.md.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, Beaker, BookOpen, Check, Copy, Flag, FlaskConical, History, Lock, Palette, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../auth/session';
import { PERMISSIONS, type Permission } from '../../auth/permissions';
import { FEATURES, featureEnabled } from '../../config/features';
import { COSMETICS } from '../../config/cosmetics';
import { allCourses, getCourse } from '../../content/registry';
import { db } from '../../services/db';
import { useCloud } from '../../state/cloud';
import { useSettings, loadSettings } from '../../state/settings';
import { useToast } from '../../components/Toasts';
import { EmptyState, PageHeader, Sheet } from '../../components/ui';
import { navigate } from '../../app/router';
import { formatDate, formatNumber, formatRelative, t } from '../../i18n';
import { useWallet } from '../economy/wallet';
import { collectDiagnostics, recentEvents, type Diagnostics } from '../../services/diagnostics';
import { auditLog, type AuditEntry } from '../../services/audit';
import { enterSandbox, exitSandbox, resetSandbox, simulateAchievements, simulateCoins, simulateLessons, simulateOnboarding, simulateStreak, simulateXp } from '../../services/devtools';
import { cardStatus } from '../../engine/srs';
import { DevChip } from './DevChip';

function Card({ icon, title, children, testId }: { icon: ReactNode; title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="card stack stack--s dev-card" aria-label={title} data-testid={testId}>
      <h2 className="card__title row" style={{ gap: 'var(--sp-2)' }}>
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function StatusCard() {
  const { principal, can } = useAuth();
  const cloud = useCloud();
  const toast = useToast();
  return (
    <Card icon={<ShieldCheck size={20} />} title={t('dev.status')} testId="dev-status">
      <p>
        {t('dev.role')}: <strong data-testid="dev-role">{t(`dev.role.${principal.role}` as never)}</strong>
        {cloud.account && (
          <span className="subtle">
            {' '}
            · {t('dev.account')}: {cloud.account.email}
          </span>
        )}
      </p>
      {can('cosmetics.useAll') && <p className="banner banner--warn">{t('dev.overrides')}</p>}
      <ul className="dev-perms">
        {PERMISSIONS.map((p: Permission) => (
          <li key={p} className={can(p) ? 'is-granted' : ''}>
            {can(p) ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />} {t(`dev.perm.${p}` as never)}
            <span className="visually-hidden">{can(p) ? '✓' : '✗'}</span>
          </li>
        ))}
      </ul>
      {principal.roleId && (
        <details className="dev-details">
          <summary>{t('dev.roleId')}</summary>
          <code className="dev-code">{principal.roleId}</code>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard?.writeText(principal.roleId!).then(() => toast(t('dev.copied')))}>
            <Copy size={16} /> {t('dev.copy')}
          </button>
          <p className="subtle">{t('dev.roleIdHelp')}</p>
        </details>
      )}
    </Card>
  );
}

function SandboxCard() {
  const { principal, sandbox } = useAuth();
  const { settings, replace } = useSettings();
  const toast = useToast();
  const [confirm, setConfirm] = useState<'copy' | 'reset' | null>(null);
  const [busy, setBusy] = useState(false);
  const course = getCourse(settings.activeCourse);

  const run = async (what: string, action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
      toast(t('dev.sim.done', { what }), 'success');
    } catch (e) {
      toast(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card icon={<FlaskConical size={20} />} title={t('dev.sandbox')} testId="dev-sandbox">
      <p className="subtle">{t('dev.sandboxDesc')}</p>
      {sandbox ? (
        <>
          <h3 className="dev-subtitle">{t('dev.sim')}</h3>
          <div className="row row--wrap">
            {[100, 1000].map((n) => (
              <button key={n} type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.coins', { amount: n }), () => simulateCoins(principal, n))} data-testid={`sim-coins-${n}`}>
                {t('dev.sim.coins', { amount: n })}
              </button>
            ))}
            {[100, 1000].map((n) => (
              <button key={n} type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.xp', { amount: n }), () => simulateXp(principal, n))}>
                {t('dev.sim.xp', { amount: n })}
              </button>
            ))}
            {[7, 30].map((n) => (
              <button key={n} type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.streak', { count: n }), () => simulateStreak(principal, n, course.id))}>
                {t('dev.sim.streak', { count: n })}
              </button>
            ))}
            <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.lessonNext'), () => simulateLessons(principal, course.id, 1))}>
              {t('dev.sim.lessonNext')}
            </button>
            <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.lessonsAll'), () => simulateLessons(principal, course.id, 'all'))}>
              {t('dev.sim.lessonsAll')} ({course.name})
            </button>
            <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => run(t('dev.sim.achievements'), () => simulateAchievements(principal))}>
              {t('dev.sim.achievements')}
            </button>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={busy}
              onClick={() =>
                run(t('dev.sim.onboarding'), async () => {
                  await simulateOnboarding(principal);
                  replace(await loadSettings());
                })
              }
            >
              {t('dev.sim.onboarding')}
            </button>
          </div>
          <div className="row row--wrap">
            <button type="button" className="btn btn--primary" onClick={exitSandbox} data-testid="sandbox-exit">
              {t('dev.sandboxExit')}
            </button>
            <button type="button" className="btn btn--ghost" style={{ color: 'var(--danger)' }} onClick={() => setConfirm('reset')}>
              {t('dev.sandboxReset')}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="subtle">{t('dev.sim.outside')}</p>
          <div className="row row--wrap">
            <button type="button" className="btn btn--primary" onClick={() => enterSandbox(principal, false)} data-testid="sandbox-enter">
              <Beaker size={18} /> {t('dev.sandboxEnter')}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setConfirm('copy')}>
              {t('dev.sandboxEnterCopy')}
            </button>
          </div>
        </>
      )}
      <Sheet open={confirm !== null} onClose={() => setConfirm(null)} title={confirm === 'reset' ? t('dev.sandboxReset') : t('dev.sandboxEnterCopy')}>
        <div className="stack">
          <p>{confirm === 'reset' ? t('dev.sandboxResetConfirm') : t('dev.sandboxCopyConfirm')}</p>
          <button
            type="button"
            className={`btn btn--lg ${confirm === 'reset' ? 'btn--danger' : 'btn--primary'}`}
            onClick={() => {
              const action = confirm;
              setConfirm(null);
              if (action === 'reset') resetSandbox(principal).then(() => toast(t('dev.sim.done', { what: t('dev.sandboxReset') })));
              else enterSandbox(principal, true);
            }}
          >
            {confirm === 'reset' ? t('dev.sandboxReset') : t('dev.sandboxEnterCopy')}
          </button>
        </div>
      </Sheet>
    </Card>
  );
}

function FeaturesCard() {
  const { principal } = useAuth();
  return (
    <Card icon={<Flag size={20} />} title={t('dev.features')} testId="dev-features">
      <ul className="list">
        {FEATURES.map((f) => {
          const on = featureEnabled(f.id, principal);
          return (
            <li key={f.id} className="list-row">
              <div className="list-row__body">
                <div className="list-row__title">{t(`feature.${f.id}` as never)}</div>
                <div className="list-row__desc">
                  {t(`dev.stage.${f.stage}` as never)} · {on ? t('dev.featureOn') : t('dev.featureOff')}
                </div>
              </div>
              {on ? <Check size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function ContentCard() {
  const progress = useLiveQuery(() => db.lessonProgress.toArray(), []);
  const done = new Set((progress ?? []).map((p) => p.id));
  return (
    <Card icon={<BookOpen size={20} />} title={t('dev.content')} testId="dev-content">
      <ul className="cloud-points">
        {allCourses().map((c) => {
          const open = c.stories.filter((s) => done.has(s.afterLesson)).length;
          return (
            <li key={c.id}>
              {t('dev.content.course', { name: c.name, done: c.lessons.filter((l) => done.has(l.id)).length, total: c.lessons.length })}
              <br />
              <span className="subtle">{t('dev.content.stories', { open, locked: c.stories.length - open })}</span>
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/audio')}>
        {t('dev.content.openAudio')}
      </button>
    </Card>
  );
}

function CosmeticsCard() {
  const wallet = useWallet();
  const { can } = useAuth();
  const total = COSMETICS.length;
  const owned = wallet ? COSMETICS.filter((c) => wallet.owned.has(c.id)).length : 0;
  return (
    <Card icon={<Palette size={20} />} title={t('dev.cosmetics')} testId="dev-cosmetics">
      <p>{can('cosmetics.useAll') ? t('dev.cosmetics.summary', { owned, total }) : t('dev.cosmetics.summaryAdmin', { owned, total })}</p>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/shop')}>
        {t('dev.cosmetics.open')}
      </button>
    </Card>
  );
}

function SrsCard() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useLiveQuery(() => db.cards.where('courseId').equals(course.id).toArray(), [course.id]);
  const rows = useMemo(() => [...(cards ?? [])].sort((a, b) => a.due - b.due).slice(0, 60), [cards]);
  const now = Date.now();
  return (
    <Card icon={<Activity size={20} />} title={t('dev.srs', { course: course.name })} testId="dev-srs">
      {rows.length === 0 ? (
        <p className="subtle">{t('dev.srs.empty')}</p>
      ) : (
        <div className="dev-table-wrap">
          <table className="dev-table">
            <thead>
              <tr>
                <th>id</th>
                <th>status</th>
                <th>interval</th>
                <th>due</th>
                <th>reps/lapses</th>
                <th>ease</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{cardStatus(c, now)}</td>
                  <td>{formatNumber(c.interval, 1)} d</td>
                  <td>{formatRelative(c.due, now)}</td>
                  <td>
                    {c.reps}/{c.lapses}
                  </td>
                  <td>{formatNumber(c.ease, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function DiagnosticsCard() {
  const cloud = useCloud();
  const { sandbox } = useAuth();
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    collectDiagnostics(db).then(setDiag).catch(() => setDiag(null));
  }, [tick]);
  const events = recentEvents();
  const mb = (n?: number) => (n === undefined ? '?' : `${formatNumber(n / 1048576, 1)} MB`);
  return (
    <Card icon={<RefreshCw size={20} />} title={t('dev.diagnostics')} testId="dev-diagnostics">
      {diag && (
        <dl className="dev-dl">
          <dt>{t('dev.diag.version')}</dt>
          <dd>
            {diag.version} ({diag.build})
          </dd>
          <dt>{t('dev.diag.platform')}</dt>
          <dd>
            {diag.platform} · {diag.userAgent}
          </dd>
          <dt>{t('dev.diag.online')}</dt>
          <dd>{String(diag.online)}</dd>
          <dt>{t('dev.diag.sw')}</dt>
          <dd>{diag.serviceWorker}</dd>
          <dt>{t('dev.diag.storage')}</dt>
          <dd>
            {mb(diag.storage.usage)} / {mb(diag.storage.quota)} · persisted: {String(diag.storage.persisted)}
          </dd>
          <dt>{t('dev.diag.db')}</dt>
          <dd>
            {diag.database.name} v{diag.database.version}
            {sandbox ? ' (sandbox)' : ''} ·{' '}
            {Object.entries(diag.database.rows)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')}
          </dd>
          <dt>{t('dev.diag.cloud')}</dt>
          <dd>
            available: {String(cloud.available)} · signed in: {String(Boolean(cloud.account))} · state: {cloud.state} · dirty: {String(cloud.dirty)}
            {cloud.lastSyncAt ? ` · ${formatRelative(cloud.lastSyncAt)}` : ''}
          </dd>
        </dl>
      )}
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTick((n) => n + 1)}>
        <RefreshCw size={16} /> {t('dev.diag.refresh')}
      </button>
      <h3 className="dev-subtitle">{t('dev.diag.events')}</h3>
      {events.length === 0 ? (
        <p className="subtle">{t('dev.diag.noEvents')}</p>
      ) : (
        <ul className="dev-log">
          {events.slice(0, 30).map((e, i) => (
            <li key={i} className={`dev-log__${e.level}`}>
              <time>{formatDate(e.at, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time> {e.message}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function AuditCard() {
  const [log, setLog] = useState<AuditEntry[] | null>(null);
  useEffect(() => {
    auditLog().then(setLog).catch(() => setLog([]));
  }, []);
  return (
    <Card icon={<History size={20} />} title={t('dev.audit')} testId="dev-audit">
      {!log?.length ? (
        <p className="subtle">{t('dev.audit.empty')}</p>
      ) : (
        <ul className="dev-log">
          {log.slice(0, 50).map((e, i) => (
            <li key={i}>
              <time>{formatDate(e.at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time> {e.action}
              {e.detail ? ` — ${e.detail}` : ''} {e.sandbox && <DevChip label="sandbox" />}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function DevScreen() {
  const { principal, can, ready } = useAuth();
  if (!ready) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  // The route itself is guarded: hiding the menu entry is not the only protection.
  if (!can('devtools.dashboard')) {
    return (
      <div className="page">
        <PageHeader title={t('dev.denied')} back fallback="/settings" />
        <EmptyState icon={<Lock size={40} />} title={t('dev.denied')} body={principal.verified ? t('dev.deniedBody') : t('dev.signedOut')} />
      </div>
    );
  }
  return (
    <div className="page page--wide dev-screen" data-testid="dev-screen">
      <PageHeader title={principal.role === 'developer' ? t('dev.title') : t('dev.adminTitle')} back fallback="/settings" />
      <div className="dev-grid">
        <StatusCard />
        {can('sandbox.use') && <SandboxCard />}
        <FeaturesCard />
        {can('devtools.catalog') && <ContentCard />}
        {can('devtools.catalog') && <CosmeticsCard />}
        {featureEnabled('srsInspector', principal) && <SrsCard />}
        {can('devtools.diagnostics') && <DiagnosticsCard />}
        {can('devtools.diagnostics') && <AuditCard />}
      </div>
      <p className="subtle">{t('dev.limits')}</p>
    </div>
  );
}
