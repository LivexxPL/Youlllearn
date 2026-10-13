import { t } from '../../i18n';

/** Marks something visible only thanks to developer access. */
export function DevChip({ label }: { label?: string }) {
  return (
    <span className="chip chip--dev" title={t('dev.previewHint')}>
      {label ?? t('dev.chip')}
    </span>
  );
}
