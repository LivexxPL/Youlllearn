/**
 * Getting the app onto a device: the browser's install prompt where it exists, step-by-step
 * instructions on iPhone/iPad, the Android APK link and a shareable link to the web app.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { CheckCircle2, Download, ExternalLink, Share2, Smartphone, X } from 'lucide-react';
import { brand } from '../../config/brand';
import { t } from '../../i18n';
import { isNative } from '../../services/platform';
import { canPromptInstall, installPlatform, isStandalone, onInstallChange, promptInstall } from '../../services/pwa';
import { getMeta, setMeta } from '../../services/db';
import { useToast } from '../../components/Toasts';

const DISMISS_KEY = 'installHintDismissed';

function useCanPromptInstall(): boolean {
  return useSyncExternalStore(onInstallChange, canPromptInstall, () => false);
}

function devicePlatform() {
  return typeof navigator === 'undefined' ? 'other' : installPlatform(navigator.userAgent, navigator.maxTouchPoints ?? 0);
}

/** Shares the web app link (share sheet on phones, clipboard elsewhere). */
function useShareLink() {
  const toast = useToast();
  return async () => {
    const url = brand.links.web;
    if (typeof navigator.share === 'function') {
      await navigator.share({ title: brand.appName, text: brand.tagline, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(t('install.linkCopied'), 'success');
    } catch {
      toast(url);
    }
  };
}

/** Settings section: how to install or update the app on this device. */
export function InstallSection() {
  const canPrompt = useCanPromptInstall();
  const share = useShareLink();
  const platform = devicePlatform();
  const [installed, setInstalled] = useState(isStandalone);
  useEffect(() => onInstallChange(() => setInstalled(isStandalone())), []);

  if (isNative()) {
    return (
      <div className="stack stack--s install">
        <p className="muted">{t('install.native')}</p>
        <a className="btn btn--outline" href={brand.links.androidRelease} target="_blank" rel="noreferrer">
          <ExternalLink size={18} /> {t('install.latest')}
        </a>
      </div>
    );
  }

  return (
    <div className="stack stack--s install" data-testid="install-section">
      {installed ? (
        <p className="row install__done">
          <CheckCircle2 size={18} /> {t('install.installed')}
        </p>
      ) : canPrompt ? (
        <>
          <p className="muted">{t('install.why')}</p>
          <button type="button" className="btn btn--primary" onClick={() => void promptInstall()}>
            <Smartphone size={18} /> {t('install.button')}
          </button>
        </>
      ) : (
        <p className="muted">{platform === 'ios' ? t('install.ios') : t('install.other')}</p>
      )}
      {platform === 'android' && !installed && (
        <>
          <p className="subtle">{t('install.android')}</p>
          <a className="btn btn--outline" href={brand.links.androidApk} data-testid="install-apk">
            <Download size={18} /> {t('install.apk')}
          </a>
        </>
      )}
      <button type="button" className="btn btn--ghost" onClick={() => void share()}>
        <Share2 size={18} /> {t('install.share')}
      </button>
    </div>
  );
}

/** Home banner on the web, shown while the app can be added to the home screen. */
export function InstallBanner() {
  const canPrompt = useCanPromptInstall();
  const platform = devicePlatform();
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  useEffect(() => {
    getMeta<boolean>(DISMISS_KEY, false)
      .then(setDismissed)
      .catch(() => setDismissed(false));
  }, []);

  const relevant = !isNative() && !isStandalone() && (canPrompt || platform === 'ios');
  if (!relevant || dismissed !== false) return null;

  const dismiss = () => {
    setDismissed(true);
    setMeta(DISMISS_KEY, true).catch(() => {});
  };
  return (
    <div className="banner install-banner" role="region" aria-label={t('install.title')} data-testid="install-banner">
      <Smartphone size={20} />
      <div className="grow stack stack--xs">
        <span>{platform === 'ios' && !canPrompt ? t('install.ios') : t('install.why')}</span>
        {canPrompt && (
          <button type="button" className="btn btn--sm btn--primary install-banner__cta" onClick={() => void promptInstall()}>
            {t('install.button')}
          </button>
        )}
      </div>
      <button type="button" className="icon-btn" onClick={dismiss} aria-label={t('install.dismiss')}>
        <X size={18} />
      </button>
    </div>
  );
}
