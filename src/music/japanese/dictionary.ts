/**
 * Builds the kuromoji tokenizer from the IPADIC dictionary files (about 17 MB compressed,
 * 100 MB in memory). Used by the analysis worker in the app and directly in unit tests.
 */
import DynamicDictionaries from 'kuromoji/src/dict/DynamicDictionaries';
import Tokenizer from 'kuromoji/src/Tokenizer';
import type { IpadicToken } from './tokens';

/**
 * The dictionary files in load order, with their compressed and unpacked sizes (for progress).
 * They are served as `<name>.dic` (still gzip data): with a neutral extension no server adds
 * `Content-Encoding: gzip`, so the browser keeps them compressed in the Cache API (17 MB, not
 * 100 MB) and the worker unpacks them itself.
 */
export const DICT_FILES: readonly { name: string; bytes: number; raw: number }[] = [
  { name: 'base.dat.gz', bytes: 3_956_825, raw: 8_388_608 },
  { name: 'check.dat.gz', bytes: 3_111_633, raw: 8_388_608 },
  { name: 'tid.dat.gz', bytes: 1_605_820, raw: 10_485_760 },
  { name: 'tid_pos.dat.gz', bytes: 5_916_009, raw: 41_943_040 },
  { name: 'tid_map.dat.gz', bytes: 1_485_576, raw: 4_194_304 },
  { name: 'cc.dat.gz', bytes: 1_692_067, raw: 3_463_716 },
  { name: 'unk.dat.gz', bytes: 10_512, raw: 10_485_760 },
  { name: 'unk_pos.dat.gz', bytes: 10_540, raw: 10_485_760 },
  { name: 'unk_map.dat.gz', bytes: 1_190, raw: 1_048_576 },
  { name: 'unk_char.dat.gz', bytes: 306, raw: 65_536 },
  { name: 'unk_compat.dat.gz', bytes: 338, raw: 262_144 },
  { name: 'unk_invoke.dat.gz', bytes: 1_140, raw: 1_048_576 },
];

/** Published file name of a dictionary file (see DICT_FILES). */
export function servedName(name: string): string {
  return name.replace(/\.dat\.gz$/, '.dic');
}

export const DICT_TOTAL_BYTES = DICT_FILES.reduce((n, f) => n + f.bytes, 0);

export interface JapaneseTokenizer {
  tokenize(text: string): IpadicToken[];
}

/** Loads one dictionary file, already decompressed. */
export type LoadFile = (name: string) => Promise<ArrayBuffer>;

/** Files are loaded one after another: only one compressed file is in memory at a time. */
export async function buildTokenizer(load: LoadFile): Promise<JapaneseTokenizer> {
  const buffers = new Map<string, ArrayBuffer>();
  for (const f of DICT_FILES) buffers.set(f.name, await load(f.name));
  const b = (name: string) => buffers.get(name)!;
  const dic = new DynamicDictionaries();
  dic.loadTrie(new Int32Array(b('base.dat.gz')), new Int32Array(b('check.dat.gz')));
  dic.loadTokenInfoDictionaries(new Uint8Array(b('tid.dat.gz')), new Uint8Array(b('tid_pos.dat.gz')), new Uint8Array(b('tid_map.dat.gz')));
  dic.loadConnectionCosts(new Int16Array(b('cc.dat.gz')));
  dic.loadUnknownDictionaries(
    new Uint8Array(b('unk.dat.gz')),
    new Uint8Array(b('unk_pos.dat.gz')),
    new Uint8Array(b('unk_map.dat.gz')),
    new Uint8Array(b('unk_char.dat.gz')),
    new Uint32Array(b('unk_compat.dat.gz')),
    new Uint8Array(b('unk_invoke.dat.gz')),
  );
  return new Tokenizer(dic);
}

/** gzip data starts with 1f 8b; a server that sent the file with Content-Encoding already unpacked it. */
export function isGzip(buf: ArrayBuffer): boolean {
  const head = new Uint8Array(buf, 0, Math.min(2, buf.byteLength));
  return head[0] === 0x1f && head[1] === 0x8b;
}
