/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_TARGET__: 'native' | 'web';

interface ImportMetaEnv {
  /** OAuth client ID (Web application) for Google sign-in; empty = account features hidden. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Role ids (src/auth/roles.ts) of developer accounts, comma-separated. */
  readonly VITE_DEVELOPER_ACCOUNTS?: string;
  /** Role ids of admin accounts, comma-separated. */
  readonly VITE_ADMIN_ACCOUNTS?: string;
}
