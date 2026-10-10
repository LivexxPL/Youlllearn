/**
 * Colour palette picker: a card per palette with a small preview in the current light/dark
 * mode, plus "surprise me" and the background-motif switch.
 */
import { Check, Dices } from 'lucide-react';
import { PALETTES, heroIsLight, motifImage, type Palette, type PaletteId } from '../../config/palettes';
import { useSettings } from '../../state/settings';
import { SettingRow, Switch } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import { t } from '../../i18n';

function paletteName(id: PaletteId): string {
  return t(`palette.${id}` as never);
}

function Preview({ palette, mode }: { palette: Palette; mode: 'light' | 'dark' }) {
  const c = palette[mode];
  const cta = heroIsLight(c) ? c.primary : c.accentBright;
  return (
    <span className="palette-card__preview" style={{ backgroundColor: c.bg, backgroundImage: motifImage(palette, mode) }} aria-hidden="true">
      <span className="palette-card__hero" style={{ background: `linear-gradient(145deg, ${c.heroFrom}, ${c.heroTo})` }}>
        <span className="palette-card__line" style={{ background: c.onHero }} />
        <span className="palette-card__cta" style={{ background: cta }} />
      </span>
      <span className="palette-card__row" style={{ background: c.surface, borderColor: c.border }}>
        <span className="palette-card__pill" style={{ background: c.primary }} />
        <span className="palette-card__dot" style={{ background: c.accentBright }} />
      </span>
    </span>
  );
}

export function PalettePicker() {
  const { settings, update, resolvedTheme } = useSettings();
  const toast = useToast();

  const choose = (id: PaletteId) => {
    if (id !== settings.palette) update({ palette: id });
  };

  /** A random pastel palette other than the current one, announced with a toast. */
  const surprise = () => {
    const others = PALETTES.filter((p) => p.id !== settings.palette && p.id !== 'classic');
    const p = others[Math.floor(Math.random() * others.length)];
    choose(p.id);
    toast(t('set.palette.changed', { emoji: p.emoji, name: paletteName(p.id) }));
  };

  return (
    <>
      <div className="list-row palette-row">
        <div className="list-row__body">
          <div className="list-row__title" id="palette-label">
            {t('set.palette')}
          </div>
          <div className="list-row__desc">{t('set.palette.desc')}</div>
        </div>
        <div className="palette-grid" role="radiogroup" aria-labelledby="palette-label" data-testid="palette-picker">
          {PALETTES.map((p) => {
            const selected = p.id === settings.palette;
            return (
              <label key={p.id} className={`palette-card${selected ? ' is-selected' : ''}`} data-testid={`palette-${p.id}`}>
                <input type="radio" name="palette" value={p.id} checked={selected} onChange={() => choose(p.id)} className="visually-hidden" />
                <Preview palette={p} mode={resolvedTheme} />
                <span className="palette-card__name">
                  <span aria-hidden="true">{p.emoji}</span> {paletteName(p.id)}
                </span>
                {selected && <Check size={16} className="palette-card__check" aria-hidden="true" />}
              </label>
            );
          })}
        </div>
        <button type="button" className="btn btn--ghost btn--sm palette-surprise" onClick={surprise}>
          <Dices size={18} /> {t('set.palette.random')}
        </button>
      </div>
      {settings.palette !== 'classic' && (
        <SettingRow
          title={t('set.pattern')}
          desc={t('set.pattern.desc')}
          control={<Switch checked={settings.bgPattern} onChange={(v) => update({ bgPattern: v })} label={t('set.pattern')} />}
        />
      )}
    </>
  );
}
