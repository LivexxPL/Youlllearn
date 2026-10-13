/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_TARGET__: 'native' | 'web';

interface ImportMetaEnv {
  /** OAuth client ID (Web application) for Google sign-in; empty = account features hidden. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}
