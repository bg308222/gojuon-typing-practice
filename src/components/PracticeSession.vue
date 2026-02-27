<template>
  <div class="practice" @keydown.esc="togglePause" @click="inputRef?.focus()" tabindex="-1">
    <!-- Header bar -->
    <div class="practice-header">
      <div class="progress-info">
        <template v-if="settings.practiceMode === 'count'">
          <span class="question-num">{{ questionsAnswered + 1 }} / {{ settings.questionCount }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
        </template>
        <template v-else-if="settings.practiceMode === 'time'">
          <span class="timer" :class="{ warning: timeLeft <= 10 }">
            {{ timeLeft }}秒
          </span>
          <div class="progress-bar">
            <div class="progress-fill time-fill" :style="{ width: timePct + '%' }"></div>
          </div>
        </template>
        <template v-else>
          <span class="question-num">第 {{ questionsAnswered + 1 }} 題</span>
        </template>
      </div>
      <div class="score-info">
        <span class="correct-count">✓ {{ correctCount }}</span>
        <span class="wrong-count">✗ {{ wrongCount }}</span>
        <button class="pause-btn" @click="togglePause">
          <svg v-if="!paused" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button class="pause-btn stop-btn" @click="emit('stop')" title="結束練習">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h12v12H6z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Pause overlay -->
    <div v-if="paused" class="pause-overlay">
      <div class="pause-card">
        <p class="pause-text">已暫停</p>
        <button class="resume-btn" @click="togglePause">繼續（Esc）</button>
      </div>
    </div>

    <!-- Main practice area -->
    <div v-else class="practice-body">
      <!-- Kana display -->
      <div class="kana-display-wrap">
        <div class="kana-display" :class="feedbackClass">
          {{ displayKana }}
        </div>
        <div v-if="settings.showHint" class="hint-text">
          {{ currentKana?.romaji.join(' / ') }}
        </div>
      </div>

      <!-- Subtle wrong indicator -->
      <div v-if="hasBeenWrong" class="wrong-hint">
        <span class="wrong-hint-text">答錯了 — 請繼續輸入正確答案</span>
        <code class="wrong-hint-answer">{{ currentKana?.romaji.join(' / ') }}</code>
      </div>

      <!-- Input area -->
      <div class="input-wrap">
        <div class="input-display">
          <span
            v-for="(char, i) in inputChars"
            :key="i"
            :class="charClass(i)"
          >{{ char }}</span>
          <span class="cursor">|</span>
        </div>
        <div class="input-hint">輸入羅馬字並按 Enter 確認</div>
      </div>

    </div>

    <!-- Hidden input always in DOM regardless of pause/wrong state -->
    <input
      ref="inputRef"
      v-model="currentInput"
      class="hidden-input"
      type="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @keydown="handleKeydown"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  type KanaEntry,
  isCorrect, shouldAutoAdvance, isWrong,
  entryFromKey, displayChar,
} from '../data/kana'
import type { AppSettings, KanaStat } from '../data/db'

const props = defineProps<{
  settings: AppSettings
  kanaStats: Record<string, KanaStat>
}>()

const emit = defineEmits<{
  stop: []
  done: [result: SessionResult]
  updateStat: [key: string, correct: boolean, time: number]
}>()

export interface SessionResult {
  total: number
  correct: number
  wrong: number
  avgTime: number
  mode: 'count' | 'time' | 'infinite'
  wrongAnswers: WrongAnswer[]
  fastestKana: string | null
  slowestKana: string | null
}

export interface WrongAnswer {
  qualKey: string
  kana: KanaEntry
  userInput: string
  correctAnswers: string[]
}

interface PoolItem { qualKey: string; entry: KanaEntry }

// State
const currentKana = ref<KanaEntry | null>(null)
const currentQualKey = ref<string>('')
const currentInput = ref('')
const paused = ref(false)
const hasBeenWrong = ref(false) // current question was already marked wrong

// Stats
const questionsAnswered = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const wrongAnswersList = ref<WrongAnswer[]>([])
const questionStartTime = ref(0)
const questionTimes = ref<{ key: string; time: number }[]>([])

// Timer
const timeLeft = ref(props.settings.timeLimit)
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

// DOM
const inputRef = ref<HTMLInputElement | null>(null)

// Selected kana pool — one entry per qualified key (e.g. "ka-h", "ka-k")
const kanaPool = computed<PoolItem[]>(() =>
  props.settings.selectedKana.flatMap(qualKey => {
    const entry = entryFromKey(qualKey)
    return entry ? [{ qualKey, entry }] : []
  })
)

// Display character based on the current qualified key
const displayKana = computed(() => {
  if (!currentQualKey.value) return ''
  return displayChar(currentQualKey.value)
})

const progressPct = computed(() => {
  if (props.settings.questionCount === 0) return 0
  return (questionsAnswered.value / props.settings.questionCount) * 100
})

const timePct = computed(() => {
  return (timeLeft.value / props.settings.timeLimit) * 100
})

const inputChars = computed(() => [...currentInput.value])

const feedbackClass = computed(() => {
  if (hasBeenWrong.value && !currentInput.value) return 'wrong-kana'
  if (currentInput.value && currentKana.value) {
    if (isCorrect(currentInput.value, currentKana.value)) return 'correct-kana'
    if (isWrong(currentInput.value, currentKana.value)) return 'wrong-kana'
  }
  return hasBeenWrong.value ? 'wrong-kana' : ''
})

function charClass(i: number): string {
  if (!currentKana.value) return ''
  const input = currentInput.value.slice(0, i + 1)
  const lower = input.toLowerCase()
  // Check if this prefix is valid
  const isPrefix = currentKana.value.romaji.some(r => r.startsWith(lower)) ||
    currentKana.value.hiragana.startsWith(input) ||
    currentKana.value.katakana.startsWith(input)
  if (!isPrefix) return 'char-wrong'
  return 'char-ok'
}

function pickNext() {
  const pool = kanaPool.value
  if (pool.length === 0) return
  let picked: PoolItem
  if (props.settings.weightedRandom) {
    const weights = pool.map(item => {
      const s = props.kanaStats[item.qualKey]
      if (!s || s.attempts === 0) return 2
      const errorRate = 1 - s.correct / s.attempts
      return 0.2 + errorRate * 4
    })
    const total = weights.reduce((a, b) => a + b, 0)
    let rand = Math.random() * total
    let idx = pool.length - 1
    for (let i = 0; i < pool.length; i++) {
      rand -= weights[i]!
      if (rand <= 0) { idx = i; break }
    }
    picked = pool[idx]!
  } else {
    picked = pool[Math.floor(Math.random() * pool.length)]!
  }
  currentQualKey.value = picked.qualKey
  currentKana.value = picked.entry
  currentInput.value = ''
  hasBeenWrong.value = false
  questionStartTime.value = Date.now()
}

function handleInput() {
  if (!currentKana.value || paused.value) return

  const input = currentInput.value
  const kana = currentKana.value

  // Wrong: record the mistake, clear input, let user keep trying
  if (isWrong(input, kana)) {
    if (!hasBeenWrong.value) {
      recordWrong(input)
    }
    currentInput.value = ''
    return
  }

  // Auto-advance on correct
  if (props.settings.autoAdvance && shouldAutoAdvance(input, kana)) {
    advanceAfterAttempt()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (paused.value) return

  if (e.key === 'Enter') {
    e.preventDefault()
    const input = currentInput.value.trim()
    const kana = currentKana.value
    if (!kana) return
    if (isCorrect(input, kana)) {
      advanceAfterAttempt()
    } else if (input.length > 0) {
      if (!hasBeenWrong.value) recordWrong(input)
      currentInput.value = ''
    }
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    togglePause()
  }
}

// Record a wrong attempt without advancing — lets user keep trying
function recordWrong(input: string) {
  const elapsed = Date.now() - questionStartTime.value
  const qualKey = currentQualKey.value
  emit('updateStat', qualKey, false, elapsed)
  wrongCount.value++
  questionsAnswered.value++
  hasBeenWrong.value = true

  wrongAnswersList.value.push({
    qualKey,
    kana: currentKana.value!,
    userInput: input,
    correctAnswers: [currentKana.value!.hiragana, currentKana.value!.katakana, ...currentKana.value!.romaji],
  })

  checkEndCondition()
}

// Called when the user finally gets the answer right (or was already wrong and got it)
function advanceAfterAttempt() {
  if (!hasBeenWrong.value) {
    // First-try correct
    const elapsed = Date.now() - questionStartTime.value
    const qualKey = currentQualKey.value
    questionTimes.value.push({ key: qualKey, time: elapsed })
    emit('updateStat', qualKey, true, elapsed)
    correctCount.value++
    questionsAnswered.value++
  }
  currentInput.value = ''
  if (!checkEndCondition()) nextQuestion()
}

function nextQuestion() {
  pickNext()
  nextTick(() => inputRef.value?.focus())
}

function checkEndCondition(): boolean {
  if (props.settings.practiceMode === 'count') {
    if (questionsAnswered.value >= props.settings.questionCount) {
      finishSession()
      return true
    }
  }
  return false
}

function finishSession() {
  if (timerInterval.value) clearInterval(timerInterval.value)

  const times = questionTimes.value
  const avgTime = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b.time, 0) / times.length)
    : 0

  const sortedByTime = [...times].sort((a, b) => a.time - b.time)
  const fastestKana = sortedByTime.length > 0 ? (sortedByTime[0]?.key ?? null) : null
  const slowestKana = sortedByTime.length > 0 ? (sortedByTime[sortedByTime.length - 1]?.key ?? null) : null

  emit('done', {
    total: questionsAnswered.value,
    correct: correctCount.value,
    wrong: wrongCount.value,
    avgTime,
    mode: props.settings.practiceMode,
    wrongAnswers: wrongAnswersList.value,
    fastestKana,
    slowestKana,
  })
}

function togglePause() {
  paused.value = !paused.value
  if (!paused.value) {
    nextTick(() => inputRef.value?.focus())
    questionStartTime.value = Date.now() // reset timer for current question
  }
}

function startTimer() {
  if (props.settings.practiceMode !== 'time') return
  timerInterval.value = setInterval(() => {
    if (paused.value) return
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value!)
      finishSession()
    }
  }, 1000)
}

onMounted(() => {
  pickNext()
  startTimer()
  nextTick(() => inputRef.value?.focus())

  window.addEventListener('keydown', globalKeydown)
})

onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value)
  window.removeEventListener('keydown', globalKeydown)
})

function globalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    togglePause()
  }
}

watch(paused, (val) => {
  if (!val) nextTick(() => inputRef.value?.focus())
})
</script>

<style scoped>
.practice {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  min-height: 480px;
}

.practice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0 1rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.question-num {
  font-size: 0.9375rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.timer {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  min-width: 3ch;
}

.timer.warning {
  color: var(--error);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.6 }
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  max-width: 300px;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 300ms ease;
}

.time-fill {
  background: var(--accent);
}

.score-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.correct-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--success);
}

.wrong-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--error);
}

.pause-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 150ms;
}

.pause-btn:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.stop-btn:hover {
  color: var(--error);
  border-color: var(--error);
}

.pause-overlay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.pause-text {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0;
}

.resume-btn {
  padding: 0.65rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--primary);
  color: #0c1a2a;
  font-weight: 700;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.resume-btn:hover {
  background: var(--primary-light);
}

.practice-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
}

.kana-display-wrap {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.kana-display {
  font-size: clamp(5rem, 15vw, 9rem);
  line-height: 1;
  color: var(--text);
  font-weight: 400;
  transition: color 150ms;
  user-select: none;
}

.kana-display.correct-kana {
  color: var(--success);
}

.kana-display.wrong-kana {
  color: var(--error);
}

.hint-text {
  font-size: 1rem;
  color: var(--text-muted);
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
}

.wrong-hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--error);
  background: color-mix(in srgb, var(--error) 8%, var(--surface-2));
  border: 1px solid color-mix(in srgb, var(--error) 25%, transparent);
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
}

.wrong-hint-text {
  color: var(--text-muted);
}

.wrong-hint-answer {
  font-family: 'Courier New', monospace;
  color: var(--success);
  background: transparent;
  font-size: 0.9375rem;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
}

.input-display {
  min-height: 3rem;
  min-width: 8rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid var(--border);
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  font-size: 1.5rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  cursor: text;
  transition: border-color 150ms;
}

.input-display:focus-within {
  border-color: var(--primary);
}

.char-ok {
  color: var(--success);
}

.char-wrong {
  color: var(--error);
}

.cursor {
  color: var(--primary);
  animation: blink 1s step-end infinite;
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}

.hidden-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
