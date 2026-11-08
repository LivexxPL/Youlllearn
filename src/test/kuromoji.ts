// Loads the kuromoji tokenizer from node_modules for unit tests (the app downloads the same
// files in a worker).
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { buildTokenizer, isGzip, type JapaneseTokenizer } from '../music/japanese/dictionary';

const DICT = new URL('../../node_modules/kuromoji/dict/', import.meta.url);
// A copy: Node buffers of small files are views into a shared pool.
const toArrayBuffer = (b: Uint8Array): ArrayBuffer => new Uint8Array(b).buffer as ArrayBuffer;

let shared: Promise<JapaneseTokenizer> | null = null;

export function testTokenizer(): Promise<JapaneseTokenizer> {
  shared ??= buildTokenizer(async (name) => {
    const buf = readFileSync(new URL(name, DICT));
    return toArrayBuffer(isGzip(toArrayBuffer(buf)) ? gunzipSync(buf) : buf);
  });
  return shared;
}
