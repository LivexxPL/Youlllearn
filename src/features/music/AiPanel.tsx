/**
 * The optional AI assistant: setup (own Anthropic API key, model, costs) and translating a
 * song. Everything it returns is labelled AI and editable; nothing runs without a click.
 */
import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ExternalLink, KeyRound, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';
import { db, setMeta } from '../../services/db';
import { updateSong } from '../../services/music';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, Sheet } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import {
  AI_LIMITS,
  AI_META_KEY,
  AI_MODELS,
  AiError,
  DEFAULT_AI_MODEL,
  applyOutput,
  estimateCost,
  estimateTokens,
  formatUsd,
  looksLikeApiKey,
  maskKey,
  modelInfo,
  translateWithAi,
  type AiConfig,
  type AiModelId,
  type AiWord,
} from '../../music/ai';
import type { PracticeWord } from '../../music/exercises';
import type { JaToken } from '../../music/japanese/tokens';
import type { Song } from '../../music/types';

export function useAiConfig(): AiConfig | null | undefined {
  return useLiveQuery(async () => {
    const rec = await db.meta.get(AI_META_KEY);
    const v = rec?.value as AiConfig | undefined;
    return v?.apiKey ? { apiKey: v.apiKey, model: modelInfo(v.model).id } : null;
  }, []);
}

function aiWords(words: readonly PracticeWord[]): AiWord[] {
  const seen = new Set<string>();
  const out: AiWord[] = [];
  for (const w of words) {
    if (w.meaning || seen.has(w.word.key)) continue;
    seen.add(w.word.key);
    out.push({ key: w.word.key, lemma: w.word.lemma, reading: w.word.reading });
  }
  return out.slice(0, AI_LIMITS.words);
}

export function AiCard({ song, words, tokens }: { song: Song; words: readonly PracticeWord[]; tokens?: Record<string, JaToken[]> }) {
  const config = useAiConfig();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const asked = useMemo(() => aiWords(words), [words]);
  const tokensEst = useMemo(() => estimateTokens(song.lang, song.lines.slice(0, AI_LIMITS.lines), asked), [song.lang, song.lines, asked]);
  const waiting = song.lang === 'ja' && !tokens;
  if (config === undefined) return null;

  const run = async () => {
    if (!config) return;
    setBusy(true);
    setError(null);
    try {
      const res = await translateWithAi(config, song, asked);
      await updateSong(song.id, applyOutput(song, res.output));
      const cost = estimateCost(config.model, res.usage);
      toast(t('music.ai.done', { lines: res.output.lines.length, words: res.output.words.length, cost: formatUsd(cost) }), 'success');
      setConfirm(false);
    } catch (e) {
      setError(t(`music.ai.error.${e instanceof AiError ? e.code : 'server'}`));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card stack" data-testid="ai-card">
      <h3 className="section-title">
        <Sparkles size={18} /> {t('music.ai.title')}
      </h3>
      {!config ? (
        <>
          <p className="muted">{t('music.ai.pitch')}</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate('/music/ai')}>
            <KeyRound size={16} /> {t('music.ai.setup')}
          </button>
        </>
      ) : (
        <>
          <p className="muted">{t('music.ai.ready', { model: modelInfo(config.model).name })}</p>
          <p className="subtle">{t('music.ai.estimate', { cost: formatUsd(estimateCost(config.model, tokensEst)), lines: Math.min(song.lines.length, AI_LIMITS.lines), words: asked.length })}</p>
          <div className="row row--wrap">
            <button type="button" className="btn btn--primary btn--sm" disabled={waiting || busy} onClick={() => setConfirm(true)} data-testid="ai-translate">
              <Sparkles size={16} /> {t('music.ai.translate')}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/music/ai')}>
              {t('music.ai.settings')}
            </button>
          </div>
        </>
      )}
      <Sheet open={confirm} onClose={() => !busy && setConfirm(false)} title={t('music.ai.confirmTitle')}>
        <div className="stack">
          <p>{t('music.ai.confirmBody', { model: config ? modelInfo(config.model).name : '' })}</p>
          <p className="banner banner--warn">
            <ShieldAlert size={18} /> {t('music.ai.privacy')}
          </p>
          <p className="muted">
            {t('music.ai.estimate', { cost: config ? formatUsd(estimateCost(config.model, tokensEst)) : '', lines: Math.min(song.lines.length, AI_LIMITS.lines), words: asked.length })}
          </p>
          {error && (
            <p className="banner banner--warn" role="alert" data-testid="ai-error">
              {error}
            </p>
          )}
          <button type="button" className="btn btn--primary btn--lg" disabled={busy} onClick={run} data-testid="ai-run">
            {busy ? t('music.ai.running') : t('music.ai.run')}
          </button>
          <button type="button" className="btn btn--outline" disabled={busy} onClick={() => setConfirm(false)}>
            {t('common.cancel')}
          </button>
        </div>
      </Sheet>
    </section>
  );
}

export default function AiSettingsScreen() {
  const config = useAiConfig();
  const toast = useToast();
  const [key, setKey] = useState('');
  const [model, setModel] = useState<AiModelId | null>(null);
  const current = model ?? config?.model ?? DEFAULT_AI_MODEL;
  // A rough price for a typical song (30 lines, 40 words) with each model.
  const sample = estimateTokens('es', Array.from({ length: 30 }, (_, i) => ({ id: `l${i}`, text: 'x'.repeat(32) })), Array.from({ length: 40 }, (_, i) => ({ key: `w${i}`, lemma: 'word' })));

  const save = async () => {
    const apiKey = key.trim() || config?.apiKey || '';
    if (!looksLikeApiKey(apiKey)) {
      toast(t('music.ai.keyInvalid'));
      return;
    }
    await setMeta(AI_META_KEY, { apiKey, model: current } satisfies AiConfig);
    setKey('');
    toast(t('music.ai.saved'), 'success');
  };
  const remove = async () => {
    await db.meta.delete(AI_META_KEY);
    setKey('');
    toast(t('music.ai.removed'));
  };

  return (
    <div className="page" data-testid="ai-settings">
      <PageHeader title={t('music.ai.title')} back fallback="/music" />
      <p className="muted">{t('music.ai.intro')}</p>
      <section className="card stack">
        <h2 className="section-title">{t('music.ai.costTitle')}</h2>
        <p>{t('music.ai.costBody')}</p>
        <ul className="list" role="radiogroup" aria-label={t('music.ai.model')}>
          {AI_MODELS.map((m) => (
            <li key={m.id}>
              <button type="button" role="radio" aria-checked={current === m.id} className="list-row" onClick={() => setModel(m.id)} data-testid={`ai-model-${m.id}`}>
                <div className="list-row__body">
                  <div className="list-row__title">
                    {m.name}
                    {m.id === DEFAULT_AI_MODEL && <span className="chip chip--accent">{t('music.ai.default')}</span>}
                  </div>
                  <div className="list-row__desc">
                    {t('music.ai.price', { input: String(m.inputPerM).replace('.', ','), output: String(m.outputPerM).replace('.', ',') })} · {t('music.ai.perSong', { cost: formatUsd(estimateCost(m.id, sample)) })}
                  </div>
                  <div className="list-row__desc">{t(`music.ai.modelNote.${m.id}`)}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <p className="subtle">{t('music.ai.costNote')}</p>
      </section>

      <section className="card stack">
        <h2 className="section-title">
          <KeyRound size={18} /> {t('music.ai.key')}
        </h2>
        {config && <p className="muted">{t('music.ai.keySaved', { key: maskKey(config.apiKey) })}</p>}
        <input
          className="input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={config ? t('music.ai.keyReplace') : 'sk-ant-…'}
          aria-label={t('music.ai.key')}
          data-testid="ai-key"
        />
        <div className="row row--wrap">
          <button type="button" className="btn btn--primary" onClick={save} disabled={!key.trim() && !config} data-testid="ai-save">
            {t('common.save')}
          </button>
          {config && (
            <button type="button" className="btn btn--ghost" onClick={remove} data-testid="ai-remove">
              <Trash2 size={16} /> {t('music.ai.removeKey')}
            </button>
          )}
        </div>
        <ul className="music-facts">
          <li>{t('music.ai.keyWhere')}</li>
          <li>{t('music.ai.keyRisk')}</li>
          <li>{t('music.ai.keyLimit')}</li>
        </ul>
        <a className="btn btn--outline btn--sm" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} /> {t('music.ai.getKey')}
        </a>
      </section>

      <section className="card stack">
        <h2 className="section-title">{t('music.ai.without')}</h2>
        <p className="muted">{t('music.ai.withoutBody')}</p>
      </section>
    </div>
  );
}
