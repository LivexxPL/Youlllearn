import { useSettings } from '../../state/settings';
import { t } from '../../i18n';
import { SettingRow, Sheet, Switch } from '../../components/ui';

/** Quick access to stylus options from the writing screens (same values as in Settings). */
export function WritingSettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update } = useSettings();
  return (
    <Sheet open={open} onClose={onClose} title={t('write.settings')}>
      <div className="list">
        <SettingRow title={t('set.stylusMode')} desc={t('set.stylusModeHelp')} control={<Switch checked={settings.stylusMode} onChange={(v) => update({ stylusMode: v })} label={t('set.stylusMode')} />} />
        <SettingRow title={t('set.penOnly')} desc={t('set.penOnlyHelp')} control={<Switch checked={settings.penOnly} onChange={(v) => update({ penOnly: v })} label={t('set.penOnly')} />} />
        <SettingRow title={t('set.leftHanded')} control={<Switch checked={settings.leftHanded} onChange={(v) => update({ leftHanded: v })} label={t('set.leftHanded')} />} />
      </div>
    </Sheet>
  );
}
