import { FlaskConical } from 'lucide-react';
import { sandboxActive } from '../../services/db';
import { exitSandbox } from '../../services/devtools';
import { t } from '../../i18n';

/** Always visible on test data, for everyone: leaving the sandbox never needs a permission. */
export function SandboxBanner() {
  if (!sandboxActive()) return null;
  return (
    <div className="sandbox-banner" role="status" data-testid="sandbox-banner">
      <FlaskConical size={18} aria-hidden="true" />
      <span className="grow">{t('dev.sandboxBanner')}</span>
      <button type="button" className="btn btn--sm btn--outline" onClick={exitSandbox}>
        {t('dev.sandboxExit')}
      </button>
    </div>
  );
}
