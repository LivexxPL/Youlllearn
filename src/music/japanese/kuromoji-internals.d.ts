/**
 * Types for the parts of kuromoji (Apache-2.0) that Music Lab uses directly. The package's own
 * DictionaryLoader needs Node's `path` and XMLHttpRequest; the app loads the dictionary files
 * itself (./dictionary.ts) and builds the tokenizer from these modules.
 */
declare module 'kuromoji/src/dict/DynamicDictionaries' {
  export default class DynamicDictionaries {
    loadTrie(base: Int32Array, check: Int32Array): this;
    loadTokenInfoDictionaries(tokenInfo: Uint8Array, pos: Uint8Array, targetMap: Uint8Array): this;
    loadConnectionCosts(cc: Int16Array): this;
    loadUnknownDictionaries(unk: Uint8Array, unkPos: Uint8Array, unkMap: Uint8Array, catMap: Uint8Array, compatCatMap: Uint32Array, invokeDef: Uint8Array): this;
  }
}

declare module 'kuromoji/src/Tokenizer' {
  import type DynamicDictionaries from 'kuromoji/src/dict/DynamicDictionaries';
  import type { IpadicToken } from '../tokens';
  export default class Tokenizer {
    constructor(dic: DynamicDictionaries);
    tokenize(text: string): IpadicToken[];
  }
}
