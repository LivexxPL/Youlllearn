// Minimal Node typings for the unit tests that read files from node_modules (the app's
// tsconfig has browser types only; the tests run in Node).
declare module 'node:fs' {
  export function readFileSync(path: URL | string): Uint8Array;
}
declare module 'node:zlib' {
  export function gunzipSync(data: Uint8Array): Uint8Array;
}
