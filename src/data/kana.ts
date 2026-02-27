export interface KanaEntry {
  key: string
  hiragana: string
  katakana: string
  romaji: string[]
  row: string
  type: 'basic' | 'dakuten' | 'handakuten' | 'combo'
}

export const KANA_TABLE: KanaEntry[] = [
  // あ行
  { key: 'a',   hiragana: 'あ', katakana: 'ア', romaji: ['a'],            row: 'a',   type: 'basic' },
  { key: 'i',   hiragana: 'い', katakana: 'イ', romaji: ['i'],            row: 'a',   type: 'basic' },
  { key: 'u',   hiragana: 'う', katakana: 'ウ', romaji: ['u'],            row: 'a',   type: 'basic' },
  { key: 'e',   hiragana: 'え', katakana: 'エ', romaji: ['e'],            row: 'a',   type: 'basic' },
  { key: 'o',   hiragana: 'お', katakana: 'オ', romaji: ['o'],            row: 'a',   type: 'basic' },
  // か行
  { key: 'ka',  hiragana: 'か', katakana: 'カ', romaji: ['ka'],           row: 'ka',  type: 'basic' },
  { key: 'ki',  hiragana: 'き', katakana: 'キ', romaji: ['ki'],           row: 'ka',  type: 'basic' },
  { key: 'ku',  hiragana: 'く', katakana: 'ク', romaji: ['ku'],           row: 'ka',  type: 'basic' },
  { key: 'ke',  hiragana: 'け', katakana: 'ケ', romaji: ['ke'],           row: 'ka',  type: 'basic' },
  { key: 'ko',  hiragana: 'こ', katakana: 'コ', romaji: ['ko'],           row: 'ka',  type: 'basic' },
  // さ行
  { key: 'sa',  hiragana: 'さ', katakana: 'サ', romaji: ['sa'],           row: 'sa',  type: 'basic' },
  { key: 'shi', hiragana: 'し', katakana: 'シ', romaji: ['shi', 'si'],    row: 'sa',  type: 'basic' },
  { key: 'su',  hiragana: 'す', katakana: 'ス', romaji: ['su'],           row: 'sa',  type: 'basic' },
  { key: 'se',  hiragana: 'せ', katakana: 'セ', romaji: ['se'],           row: 'sa',  type: 'basic' },
  { key: 'so',  hiragana: 'そ', katakana: 'ソ', romaji: ['so'],           row: 'sa',  type: 'basic' },
  // た行
  { key: 'ta',  hiragana: 'た', katakana: 'タ', romaji: ['ta'],           row: 'ta',  type: 'basic' },
  { key: 'chi', hiragana: 'ち', katakana: 'チ', romaji: ['chi', 'ti'],    row: 'ta',  type: 'basic' },
  { key: 'tsu', hiragana: 'つ', katakana: 'ツ', romaji: ['tsu', 'tu'],    row: 'ta',  type: 'basic' },
  { key: 'te',  hiragana: 'て', katakana: 'テ', romaji: ['te'],           row: 'ta',  type: 'basic' },
  { key: 'to',  hiragana: 'と', katakana: 'ト', romaji: ['to'],           row: 'ta',  type: 'basic' },
  // な行
  { key: 'na',  hiragana: 'な', katakana: 'ナ', romaji: ['na'],           row: 'na',  type: 'basic' },
  { key: 'ni',  hiragana: 'に', katakana: 'ニ', romaji: ['ni'],           row: 'na',  type: 'basic' },
  { key: 'nu',  hiragana: 'ぬ', katakana: 'ヌ', romaji: ['nu'],           row: 'na',  type: 'basic' },
  { key: 'ne',  hiragana: 'ね', katakana: 'ネ', romaji: ['ne'],           row: 'na',  type: 'basic' },
  { key: 'no',  hiragana: 'の', katakana: 'ノ', romaji: ['no'],           row: 'na',  type: 'basic' },
  // は行
  { key: 'ha',  hiragana: 'は', katakana: 'ハ', romaji: ['ha'],           row: 'ha',  type: 'basic' },
  { key: 'hi',  hiragana: 'ひ', katakana: 'ヒ', romaji: ['hi'],           row: 'ha',  type: 'basic' },
  { key: 'fu',  hiragana: 'ふ', katakana: 'フ', romaji: ['fu', 'hu'],     row: 'ha',  type: 'basic' },
  { key: 'he',  hiragana: 'へ', katakana: 'ヘ', romaji: ['he'],           row: 'ha',  type: 'basic' },
  { key: 'ho',  hiragana: 'ほ', katakana: 'ホ', romaji: ['ho'],           row: 'ha',  type: 'basic' },
  // ま行
  { key: 'ma',  hiragana: 'ま', katakana: 'マ', romaji: ['ma'],           row: 'ma',  type: 'basic' },
  { key: 'mi',  hiragana: 'み', katakana: 'ミ', romaji: ['mi'],           row: 'ma',  type: 'basic' },
  { key: 'mu',  hiragana: 'む', katakana: 'ム', romaji: ['mu'],           row: 'ma',  type: 'basic' },
  { key: 'me',  hiragana: 'め', katakana: 'メ', romaji: ['me'],           row: 'ma',  type: 'basic' },
  { key: 'mo',  hiragana: 'も', katakana: 'モ', romaji: ['mo'],           row: 'ma',  type: 'basic' },
  // や行
  { key: 'ya',  hiragana: 'や', katakana: 'ヤ', romaji: ['ya'],           row: 'ya',  type: 'basic' },
  { key: 'yu',  hiragana: 'ゆ', katakana: 'ユ', romaji: ['yu'],           row: 'ya',  type: 'basic' },
  { key: 'yo',  hiragana: 'よ', katakana: 'ヨ', romaji: ['yo'],           row: 'ya',  type: 'basic' },
  // ら行
  { key: 'ra',  hiragana: 'ら', katakana: 'ラ', romaji: ['ra'],           row: 'ra',  type: 'basic' },
  { key: 'ri',  hiragana: 'り', katakana: 'リ', romaji: ['ri'],           row: 'ra',  type: 'basic' },
  { key: 'ru',  hiragana: 'る', katakana: 'ル', romaji: ['ru'],           row: 'ra',  type: 'basic' },
  { key: 're',  hiragana: 'れ', katakana: 'レ', romaji: ['re'],           row: 'ra',  type: 'basic' },
  { key: 'ro',  hiragana: 'ろ', katakana: 'ロ', romaji: ['ro'],           row: 'ra',  type: 'basic' },
  // わ行・ん
  { key: 'wa',  hiragana: 'わ', katakana: 'ワ', romaji: ['wa'],           row: 'wa',  type: 'basic' },
  { key: 'wo',  hiragana: 'を', katakana: 'ヲ', romaji: ['wo'],           row: 'wa',  type: 'basic' },
  { key: 'nn',  hiragana: 'ん', katakana: 'ン', romaji: ['n', 'nn', "n'"], row: 'wa', type: 'basic' },
  // が行
  { key: 'ga',  hiragana: 'が', katakana: 'ガ', romaji: ['ga'],           row: 'ga',  type: 'dakuten' },
  { key: 'gi',  hiragana: 'ぎ', katakana: 'ギ', romaji: ['gi'],           row: 'ga',  type: 'dakuten' },
  { key: 'gu',  hiragana: 'ぐ', katakana: 'グ', romaji: ['gu'],           row: 'ga',  type: 'dakuten' },
  { key: 'ge',  hiragana: 'げ', katakana: 'ゲ', romaji: ['ge'],           row: 'ga',  type: 'dakuten' },
  { key: 'go',  hiragana: 'ご', katakana: 'ゴ', romaji: ['go'],           row: 'ga',  type: 'dakuten' },
  // ざ行
  { key: 'za',  hiragana: 'ざ', katakana: 'ザ', romaji: ['za'],           row: 'za',  type: 'dakuten' },
  { key: 'ji',  hiragana: 'じ', katakana: 'ジ', romaji: ['ji', 'zi'],     row: 'za',  type: 'dakuten' },
  { key: 'zu',  hiragana: 'ず', katakana: 'ズ', romaji: ['zu'],           row: 'za',  type: 'dakuten' },
  { key: 'ze',  hiragana: 'ぜ', katakana: 'ゼ', romaji: ['ze'],           row: 'za',  type: 'dakuten' },
  { key: 'zo',  hiragana: 'ぞ', katakana: 'ゾ', romaji: ['zo'],           row: 'za',  type: 'dakuten' },
  // だ行
  { key: 'da',  hiragana: 'だ', katakana: 'ダ', romaji: ['da'],           row: 'da',  type: 'dakuten' },
  { key: 'di',  hiragana: 'ぢ', katakana: 'ヂ', romaji: ['di'],           row: 'da',  type: 'dakuten' },
  { key: 'du',  hiragana: 'づ', katakana: 'ヅ', romaji: ['du'],           row: 'da',  type: 'dakuten' },
  { key: 'de',  hiragana: 'で', katakana: 'デ', romaji: ['de'],           row: 'da',  type: 'dakuten' },
  { key: 'do',  hiragana: 'ど', katakana: 'ド', romaji: ['do'],           row: 'da',  type: 'dakuten' },
  // ば行
  { key: 'ba',  hiragana: 'ば', katakana: 'バ', romaji: ['ba'],           row: 'ba',  type: 'dakuten' },
  { key: 'bi',  hiragana: 'び', katakana: 'ビ', romaji: ['bi'],           row: 'ba',  type: 'dakuten' },
  { key: 'bu',  hiragana: 'ぶ', katakana: 'ブ', romaji: ['bu'],           row: 'ba',  type: 'dakuten' },
  { key: 'be',  hiragana: 'べ', katakana: 'ベ', romaji: ['be'],           row: 'ba',  type: 'dakuten' },
  { key: 'bo',  hiragana: 'ぼ', katakana: 'ボ', romaji: ['bo'],           row: 'ba',  type: 'dakuten' },
  // ぱ行
  { key: 'pa',  hiragana: 'ぱ', katakana: 'パ', romaji: ['pa'],           row: 'pa',  type: 'handakuten' },
  { key: 'pi',  hiragana: 'ぴ', katakana: 'ピ', romaji: ['pi'],           row: 'pa',  type: 'handakuten' },
  { key: 'pu',  hiragana: 'ぷ', katakana: 'プ', romaji: ['pu'],           row: 'pa',  type: 'handakuten' },
  { key: 'pe',  hiragana: 'ぺ', katakana: 'ペ', romaji: ['pe'],           row: 'pa',  type: 'handakuten' },
  { key: 'po',  hiragana: 'ぽ', katakana: 'ポ', romaji: ['po'],           row: 'pa',  type: 'handakuten' },
  // 拗音 (combo)
  { key: 'kya', hiragana: 'きゃ', katakana: 'キャ', romaji: ['kya'],         row: 'kya', type: 'combo' },
  { key: 'kyu', hiragana: 'きゅ', katakana: 'キュ', romaji: ['kyu'],         row: 'kya', type: 'combo' },
  { key: 'kyo', hiragana: 'きょ', katakana: 'キョ', romaji: ['kyo'],         row: 'kya', type: 'combo' },
  { key: 'sha', hiragana: 'しゃ', katakana: 'シャ', romaji: ['sha', 'sya'],  row: 'sha', type: 'combo' },
  { key: 'shu', hiragana: 'しゅ', katakana: 'シュ', romaji: ['shu', 'syu'],  row: 'sha', type: 'combo' },
  { key: 'sho', hiragana: 'しょ', katakana: 'ショ', romaji: ['sho', 'syo'],  row: 'sha', type: 'combo' },
  { key: 'cha', hiragana: 'ちゃ', katakana: 'チャ', romaji: ['cha', 'tya'],  row: 'cha', type: 'combo' },
  { key: 'chu', hiragana: 'ちゅ', katakana: 'チュ', romaji: ['chu', 'tyu'],  row: 'cha', type: 'combo' },
  { key: 'cho', hiragana: 'ちょ', katakana: 'チョ', romaji: ['cho', 'tyo'],  row: 'cha', type: 'combo' },
  { key: 'nya', hiragana: 'にゃ', katakana: 'ニャ', romaji: ['nya'],         row: 'nya', type: 'combo' },
  { key: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', romaji: ['nyu'],         row: 'nya', type: 'combo' },
  { key: 'nyo', hiragana: 'にょ', katakana: 'ニョ', romaji: ['nyo'],         row: 'nya', type: 'combo' },
  { key: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', romaji: ['hya'],         row: 'hya', type: 'combo' },
  { key: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', romaji: ['hyu'],         row: 'hya', type: 'combo' },
  { key: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', romaji: ['hyo'],         row: 'hya', type: 'combo' },
  { key: 'mya', hiragana: 'みゃ', katakana: 'ミャ', romaji: ['mya'],         row: 'mya', type: 'combo' },
  { key: 'myu', hiragana: 'みゅ', katakana: 'ミュ', romaji: ['myu'],         row: 'mya', type: 'combo' },
  { key: 'myo', hiragana: 'みょ', katakana: 'ミョ', romaji: ['myo'],         row: 'mya', type: 'combo' },
  { key: 'rya', hiragana: 'りゃ', katakana: 'リャ', romaji: ['rya'],         row: 'rya', type: 'combo' },
  { key: 'ryu', hiragana: 'りゅ', katakana: 'リュ', romaji: ['ryu'],         row: 'rya', type: 'combo' },
  { key: 'ryo', hiragana: 'りょ', katakana: 'リョ', romaji: ['ryo'],         row: 'rya', type: 'combo' },
  { key: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', romaji: ['gya'],         row: 'gya', type: 'combo' },
  { key: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', romaji: ['gyu'],         row: 'gya', type: 'combo' },
  { key: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', romaji: ['gyo'],         row: 'gya', type: 'combo' },
  { key: 'ja',  hiragana: 'じゃ', katakana: 'ジャ', romaji: ['ja', 'zya'],   row: 'ja',  type: 'combo' },
  { key: 'ju',  hiragana: 'じゅ', katakana: 'ジュ', romaji: ['ju', 'zyu'],   row: 'ja',  type: 'combo' },
  { key: 'jo',  hiragana: 'じょ', katakana: 'ジョ', romaji: ['jo', 'zyo'],   row: 'ja',  type: 'combo' },
  { key: 'bya', hiragana: 'びゃ', katakana: 'ビャ', romaji: ['bya'],         row: 'bya', type: 'combo' },
  { key: 'byu', hiragana: 'びゅ', katakana: 'ビュ', romaji: ['byu'],         row: 'bya', type: 'combo' },
  { key: 'byo', hiragana: 'びょ', katakana: 'ビョ', romaji: ['byo'],         row: 'bya', type: 'combo' },
  { key: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', romaji: ['pya'],         row: 'pya', type: 'combo' },
  { key: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', romaji: ['pyu'],         row: 'pya', type: 'combo' },
  { key: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', romaji: ['pyo'],         row: 'pya', type: 'combo' },
]

export const ROW_GROUPS = [
  { id: 'basic', label: '清音', rows: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'] },
  { id: 'dakuten', label: '濁音', rows: ['ga', 'za', 'da', 'ba'] },
  { id: 'handakuten', label: '半濁音', rows: ['pa'] },
  { id: 'combo', label: '拗音', rows: ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'] },
]

export const ROW_LABELS: Record<string, string> = {
  'a': 'あ行', 'ka': 'か行', 'sa': 'さ行', 'ta': 'た行', 'na': 'な行',
  'ha': 'は行', 'ma': 'ま行', 'ya': 'や行', 'ra': 'ら行', 'wa': 'わ行・ん',
  'ga': 'が行', 'za': 'ざ行', 'da': 'だ行', 'ba': 'ば行', 'pa': 'ぱ行',
  'kya': 'きゃ行', 'sha': 'しゃ行', 'cha': 'ちゃ行', 'nya': 'にゃ行',
  'hya': 'ひゃ行', 'mya': 'みゃ行', 'rya': 'りゃ行', 'gya': 'ぎゃ行',
  'ja': 'じゃ行', 'bya': 'びゃ行', 'pya': 'ぴゃ行',
}

export type ScriptType = 'hiragana' | 'katakana' | 'both'

/** Convert a base kana key to a script-qualified key: "ka" → "ka-h" or "ka-k" */
export function toHiraKey(baseKey: string): string { return baseKey + '-h' }
export function toKataKey(baseKey: string): string { return baseKey + '-k' }

/** Extract base key and script from a qualified key: "ka-h" → { base: "ka", script: "hiragana" } */
export function parseKey(qualKey: string): { base: string; script: 'hiragana' | 'katakana' } {
  if (qualKey.endsWith('-k')) return { base: qualKey.slice(0, -2), script: 'katakana' }
  if (qualKey.endsWith('-h')) return { base: qualKey.slice(0, -2), script: 'hiragana' }
  // Legacy bare key — treat as hiragana
  return { base: qualKey, script: 'hiragana' }
}

/** Get the KanaEntry for a qualified key */
export function entryFromKey(qualKey: string): KanaEntry | undefined {
  const { base } = parseKey(qualKey)
  return KANA_TABLE.find(k => k.key === base)
}

/** Get the display character for a qualified key */
export function displayChar(qualKey: string): string {
  const { base, script } = parseKey(qualKey)
  const entry = KANA_TABLE.find(k => k.key === base)
  if (!entry) return qualKey
  return script === 'katakana' ? entry.katakana : entry.hiragana
}

/** Returns accepted inputs for a kana entry */
export function getAcceptedInputs(kana: KanaEntry): string[] {
  return [kana.hiragana, kana.katakana, ...kana.romaji]
}

/** Check if input is an exact match */
export function isCorrect(input: string, kana: KanaEntry): boolean {
  const lower = input.toLowerCase()
  return kana.romaji.includes(lower) || input === kana.hiragana || input === kana.katakana
}

/** Check if input is a valid prefix of any accepted romaji */
export function isValidPrefix(input: string, kana: KanaEntry): boolean {
  if (input === '') return true
  const lower = input.toLowerCase()
  // Direct kana input
  if (kana.hiragana.startsWith(input) || kana.katakana.startsWith(input)) return true
  // Romaji prefix
  return kana.romaji.some(r => r.startsWith(lower))
}

/** Whether auto-advance should trigger (correct but not ambiguous n) */
export function shouldAutoAdvance(input: string, kana: KanaEntry): boolean {
  if (!isCorrect(input, kana)) return false
  // For ん, single 'n' is ambiguous — wait for explicit confirm
  if (kana.key === 'nn' && input.toLowerCase() === 'n') return false
  return true
}

/** Weighted random pick based on error rate */
export function pickWeightedKana(
  kanaList: KanaEntry[],
  stats: Record<string, { attempts: number; correct: number; totalTime: number }>,
): KanaEntry {
  const weights = kanaList.map(k => {
    const s = stats[k.key]
    if (!s || s.attempts === 0) return 2
    const errorRate = 1 - s.correct / s.attempts
    return 0.2 + errorRate * 4
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let rand = Math.random() * total
  for (let i = 0; i < kanaList.length; i++) {
    rand -= weights[i]!
    if (rand <= 0) return kanaList[i]!
  }
  return kanaList[kanaList.length - 1]!
}

/** Check if a character sequence typed so far is wrong (no valid continuation) */
export function isWrong(input: string, kana: KanaEntry): boolean {
  if (input === '') return false
  return !isValidPrefix(input, kana) && !isCorrect(input, kana)
}
