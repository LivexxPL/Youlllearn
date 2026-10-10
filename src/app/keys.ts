/** Guards for global keyboard shortcuts. */

/** True when a key event belongs to a text field, so a shortcut must not take it. */
export function isTextEntry(target: EventTarget | null): boolean {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
}

/** True while a modal dialog is open: shortcuts of the screen behind it must not fire. */
export function modalOpen(): boolean {
  return typeof document !== 'undefined' && document.querySelector('[aria-modal="true"]') !== null;
}

/** Shortcuts of a screen apply only when the user is not typing and no dialog covers it. */
export function screenShortcutAllowed(e: KeyboardEvent): boolean {
  return !e.isComposing && !isTextEntry(e.target) && !modalOpen();
}
