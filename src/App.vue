<template>
  <div class="app">
    <!-- Navigation -->
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-kana">あ</span>
          <div class="brand-text">
            <span class="brand-title">五十音</span>
            <span class="brand-sub">打字練習</span>
          </div>
        </div>
        <nav class="nav">
          <button
            class="nav-btn"
            :class="{ active: view === 'home' }"
            @click="goHome"
          >練習</button>
          <button
            class="nav-btn"
            :class="{ active: view === 'stats' }"
            @click="view = 'stats'"
          >統計</button>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="app-main">
      <div class="content-wrap">

        <!-- Home / Setup view -->
        <div v-if="view === 'home'" class="home-layout">
          <div class="selector-col">
            <KanaSelector :settings="settings" />
          </div>
          <div class="settings-col">
            <SettingsPanel :settings="settings" />
            <div class="start-box">
              <span class="count-label">已選 {{ settings.selectedKana.length }} 個假名</span>
              <button
                class="start-btn"
                :disabled="settings.selectedKana.length === 0"
                @click="startPractice"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                開始練習
              </button>
            </div>
          </div>
        </div>

        <!-- Practice view -->
        <div v-else-if="view === 'practice'" class="practice-layout">
          <PracticeSession
            :settings="settings"
            :kana-stats="kanaStats"
            @stop="goHome"
            @done="onSessionDone"
            @update-stat="updateStat"
          />
        </div>

        <!-- Result view -->
        <div v-else-if="view === 'result' && lastResult" class="result-layout">
          <ResultScreen
            :result="lastResult"
            @back="goHome"
            @restart="startPractice"
          />
        </div>

        <!-- Stats view -->
        <div v-else-if="view === 'stats'" class="stats-layout">
          <StatsView
            :kana-stats="kanaStats"
            :sessions="sessions"
            @cleared="onCleared"
          />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, toRaw } from 'vue'
import { db, type AppSettings, type KanaStat, type Session } from './data/db'
import KanaSelector from './components/KanaSelector.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import PracticeSession from './components/PracticeSession.vue'
import ResultScreen from './components/ResultScreen.vue'
import StatsView from './components/StatsView.vue'
import type { SessionResult } from './components/PracticeSession.vue'

type View = 'home' | 'practice' | 'result' | 'stats'

const view = ref<View>('home')
const settings = ref<AppSettings>({
  selectedKana: [],
  practiceMode: 'count',
  questionCount: 20,
  timeLimit: 60,
  weightedRandom: true,
  autoAdvance: true,
  showHint: false,
  romajiVariants: true,
})
const kanaStats = ref<Record<string, KanaStat>>({})
const sessions = ref<Session[]>([])
const lastResult = ref<SessionResult | null>(null)

// Load from IndexedDB on mount
onMounted(async () => {
  settings.value = await db.loadSettings()
  kanaStats.value = await db.loadKanaStats()
  sessions.value = await db.loadSessions()
})

// Persist settings on change
let saveTimeout: ReturnType<typeof setTimeout> | null = null
watch(settings, () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => db.saveSettings(toRaw(settings.value)), 500)
}, { deep: true })

function goHome() {
  view.value = 'home'
}

function startPractice() {
  if (settings.value.selectedKana.length === 0) return
  view.value = 'practice'
}

function updateStat(key: string, correct: boolean, time: number) {
  const prev = kanaStats.value[key] ?? { attempts: 0, correct: 0, totalTime: 0 }
  kanaStats.value[key] = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
    totalTime: prev.totalTime + time,
  }
  db.saveKanaStats(toRaw(kanaStats.value))
}

async function onSessionDone(result: SessionResult) {
  lastResult.value = result
  view.value = 'result'

  const session: Omit<Session, 'id'> = {
    date: new Date().toISOString(),
    mode: result.mode,
    selectedKana: [...toRaw(settings.value.selectedKana)],
    total: result.total,
    correct: result.correct,
    avgTime: result.avgTime,
  }
  await db.addSession(session)
  sessions.value = await db.loadSessions()
}

function onCleared() {
  kanaStats.value = {}
  sessions.value = []
  settings.value = {
    selectedKana: [],
    practiceMode: 'count',
    questionCount: 20,
    timeLimit: 60,
    weightedRandom: true,
    autoAdvance: true,
    showHint: false,
    romajiVariants: true,
  }
}

// Global keyboard shortcuts
function handleGlobalKey(e: KeyboardEvent) {
  // Enter: 首頁開始練習 / 結果頁再練一次
  if (e.key === 'Enter') {
    if (view.value === 'home') {
      e.preventDefault()
      startPractice()
      return
    }
    if (view.value === 'result') {
      e.preventDefault()
      startPractice()
      return
    }
  }

  // Escape: 回到首頁（練習中由 PracticeSession 自行處理暫停邏輯）
  if (e.key === 'Escape') {
    if (view.value === 'home' || view.value === 'result' || view.value === 'stats') {
      e.preventDefault()
      goHome()
    }
    // view === 'practice' 的 Escape 由 PracticeSession 處理
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey))
import { onUnmounted } from 'vue'
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey))
</script>

<style>
/* ========================
   Global Design Tokens
   ======================== */
:root {
  --bg:           #0F172A;
  --surface:      #1E293B;
  --surface-2:    #162032;
  --surface-hover:#2D3F55;
  --border:       #2D3F55;
  --text:         #F1F5F9;
  --text-muted:   #94A3B8;
  --primary:      #38BDF8;
  --primary-light:#7DD3FC;
  --accent:       #FBBF24;
  --success:      #4ADE80;
  --error:        #F87171;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  min-height: 100dvh;
}

#app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

button {
  font-family: inherit;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--surface);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Motion reduction */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

/* Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-kana {
  font-size: 2rem;
  line-height: 1;
  color: var(--primary);
  font-family: 'Noto Serif JP', serif;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  font-family: 'Noto Serif JP', serif;
}

.brand-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-btn {
  padding: 0.4rem 0.875rem;
  border-radius: 0.4rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 150ms;
}

.nav-btn:hover {
  color: var(--text);
  background: var(--surface-hover);
}

.nav-btn.active {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
}

/* Main */
.app-main {
  flex: 1;
  padding: 1.5rem;
}

.content-wrap {
  max-width: 1200px;
  margin: 0 auto;
}

/* Home layout */
.home-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

.settings-col {
  position: sticky;
  top: calc(3.25rem + 1.5rem); /* header height + padding */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.start-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.count-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-align: center;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--primary);
  color: #0c1a2a;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.start-btn:hover:not(:disabled) {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--primary) 40%, transparent);
}

.start-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .home-layout {
    grid-template-columns: 1fr;
  }

  .settings-col {
    position: static;
    order: -1;
  }
}

/* Practice layout */
.practice-layout,
.result-layout,
.stats-layout {
  max-width: 780px;
  margin: 0 auto;
}
</style>
