# Content sources and licences

This file lists every third-party resource bundled with Polyglot Quest. It also lists the
candidate resources that were evaluated but **not** used, and the reason for each.

**How this was checked (2026-10-09).** Licences of bundled npm packages were read from the
packages themselves (`package.json` and the bundled licence texts). Licence facts about
external projects were checked through web search results and the projects' own README or
description pages as shown in those results. The development sandbox could not open most
external sites directly (DNS/proxy restrictions), so the full terms pages were not read. Read
the linked pages yourself before adding any of the "not used" resources.

## 1. Bundled with the app

| Resource | URL | Intended use | Licence | Attribution requirements | Offline redistribution | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| **Polyglot Quest course content**: vocabulary, sentences, dialogues, grammar notes, exercises, stories and Polish explanations for es/de/ja | this repository (`src/content/`) | All lessons, reviews and Audio Quest material | Written from scratch for this project; the repository owner decides the licence (see README → Licensing) | n/a | Yes (it is the project's own work) | Proofreading by native speakers is still recommended before publication (see docs/CURRICULUM.md). |
| **KanjiVG** stroke data, extracted for 251 characters (hiragana, katakana and 90 kanji: the 62 taught kanji plus those in example words) | https://kanjivg.tagaini.net · npm republication: https://github.com/mkurcius/kanjivg (`@madcat/kanjivg` 5.0.0) | Stroke-order animation, tracing templates and rule-based stroke hints | **CC BY-SA 3.0** (Unported); the full licence text ships in the npm package's `COPYING` file | Credit "KanjiVG © Ulrich Apel and contributors", link the licence and **mark the changes**. Done in `src/content/ja/STROKES_LICENSE.md` and in the app under Ustawienia → O aplikacji → Źródła i licencje. | Yes, provided the derived file stays under CC BY-SA 3.0 | Share-alike applies to the derived stroke file (`strokes.json`), not to the rest of the code. The extraction keeps only the path data, in stroke order. |
| **Plus Jakarta Sans** (variable font, via `@fontsource-variable/plus-jakarta-sans`) | https://github.com/tokotype/PlusJakartaSans | UI typeface | SIL Open Font License 1.1 | Keep the copyright/licence notice with the font files (the npm package includes it). Listed on the About page. | Yes (OFL allows bundling) | The font must not be sold on its own. |
| **Lucide** icons (`lucide-react`) | https://lucide.dev | UI icons | ISC | Licence notice in the package; listed on the About page | Yes | None known |
| Runtime libraries: React (MIT), Dexie (Apache-2.0), Capacitor and official plugins (MIT), `@capacitor-community` text-to-speech / speech-recognition / keep-awake (MIT), Workbox (MIT) | https://react.dev · https://dexie.org · https://capacitorjs.com · https://github.com/capacitor-community | Application code | As listed | Keep licence notices (bundled in `node_modules`, listed on the About page) | Yes | None known |

## 2. Used at runtime but not bundled

| Resource | URL | Intended use | Licence | Attribution requirements | Offline redistribution | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| **Device text-to-speech voices**: Web Speech API `speechSynthesis` in browsers; Android TextToSpeech through the native plugin | https://developer.mozilla.org/docs/Web/API/Web_Speech_API | All pronunciation audio | Owned by the OS or browser vendor; the app only asks the engine to speak | None (nothing is redistributed) | Not applicable: nothing is copied into the app. Works offline only when the voice is installed locally. | Quality and availability vary by device. Some browser voices are network voices. See docs/AUDIO.md. |
| **Speech recognition** (optional, off by default): Web Speech API `SpeechRecognition` / Android SpeechRecognizer | https://developer.mozilla.org/docs/Web/API/SpeechRecognition | Shows "what the recogniser understood" in speaking exercises | Vendor service | None | Not applicable | According to MDN, Chrome sends the audio to a server-based engine, so it needs internet and is not private. The app says this before the feature can be turned on. |

## 3. Evaluated but not used

| Resource | URL | Intended use (if added) | Licence (as found) | Attribution requirements | Offline redistribution | Why not used / limitations |
| --- | --- | --- | --- | --- | --- | --- |
| **Tatoeba** sentences | https://tatoeba.org/downloads | Extra example sentences | Text: CC BY 2.0 FR by default; some sentences also CC0. Audio: per-contributor licences. | Credit Tatoeba with a link and the licence; audio needs per-contributor credit | Allowed under the licence terms | Site not reachable from the build sandbox. Sentence quality varies, and per-sentence provenance would need tracking. The original course content is enough for the MVP. |
| **Lingua Libre** / Wikimedia Commons pronunciation recordings | https://lingualibre.org · https://commons.wikimedia.org | Recorded human audio instead of TTS | Lingua Libre recordings: CC BY-SA 4.0 (other Commons files vary; check each one) | Per-file credit (speaker or username, licence, link) | Allowed under the licence terms | Not reachable from the sandbox. Coverage of whole sentences is uneven. `src/services/audio/recorded.ts` is the ready extension point for adding licensed recordings later. |
| **Wiktionary** / dictionary datasets | https://www.wiktionary.org | Glosses, IPA | Wikimedia text: CC BY-SA 4.0 and GFDL (re-users may follow either). Imported passages can carry other licences, so check each page. | Credit the authors and share-alike | Allowed under the licence terms | Not needed: glosses were written for Polish learners directly. Share-alike would have to cover any derived lexicon. |
| **Tofugu** hiragana/katakana guides | https://www.tofugu.com/japanese/learn-hiragana/ | Kana mnemonics | No open licence found. Some pages informally allow teacher use; that is not a licence. | n/a | **No**: publicly accessible ≠ openly licensed | Not used. The kana tips in the course are original text. |
| **eSpeak NG** | https://github.com/espeak-ng/espeak-ng | Offline open-source TTS fallback | GPL-3.0-or-later | Licence notices; GPL obligations if distributed in the app | Allowed, but GPL terms apply to the combined distribution | The project describes its formant synthesis as clear but less natural than synthesizers built on recorded speech. Not evaluated by ear here: the sandbox has no audio output. Bundling it in the APK would bring GPL obligations. Device voices are preferred where they are installed. |
| **Whisper-compatible ASR** (e.g. whisper.cpp) | https://github.com/ggml-org/whisper.cpp | Offline speech recognition | Code reported as MIT. Model weights are also reported as MIT, but only by third-party mirrors; check the upstream LICENSE files before bundling. | Licence notices | Likely yes; verify first | Models of tens to hundreds of MB, plus noticeable CPU and battery cost on phones. Even then it only transcribes; it cannot assess pronunciation or pitch accent. Left as a future option (docs/AUDIO.md). |

## 4. Rules for adding content

1. Record every new dataset, recording, image or substantial text here **before** merging it.
2. Check the licence of each file, not just the platform. Wikimedia Commons, Tatoeba audio
   and similar sources mix licences.
3. Bundle only content whose licence allows offline redistribution, and keep the required
   attribution next to it and on the About page.
4. The core course must keep working if a third-party resource disappears. Nothing in the
   app fetches content from the network.
