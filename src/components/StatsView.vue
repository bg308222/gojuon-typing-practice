<template>
  <div class="stats">
    <div class="stats-header">
      <h2 class="stats-title">學習統計</h2>
      <div class="header-actions">
        <button class="icon-btn" title="匯出 JSON" @click="exportData">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        </button>
        <button class="icon-btn danger" title="清除所有資料" @click="confirmClear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    </div>

    <div class="stats-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <!-- Kana Stats Tab -->
    <div v-if="activeTab === 'kana'" class="tab-content">
      <div class="sort-controls">
        <label class="sort-label">排序：</label>
        <select v-model="sortBy" class="sort-select">
          <option value="accuracy-asc">正確率（低→高）</option>
          <option value="accuracy-desc">正確率（高→低）</option>
          <option value="attempts-desc">練習次數（多→少）</option>
          <option value="speed-asc">平均速度（快→慢）</option>
        </select>
      </div>

      <div v-if="sortedKanaStats.length === 0" class="empty-state">
        <p>尚無練習記錄</p>
      </div>
      <div v-else class="kana-table">
        <div class="table-header">
          <span>假名</span>
          <span>練習次數</span>
          <span>正確率</span>
          <span>平均用時</span>
        </div>
        <div
          v-for="row in sortedKanaStats"
          :key="row.qualKey"
          class="table-row"
        >
          <span class="table-kana">{{ row.display }}</span>
          <span class="table-val">{{ row.attempts }}</span>
          <span class="table-accuracy">
            <span class="accuracy-bar-wrap">
              <span
                class="accuracy-bar-fill"
                :style="{
                  width: row.accuracy + '%',
                  background: accuracyBarColor(row.accuracy),
                }"
              ></span>
            </span>
            <span class="accuracy-pct" :style="{ color: accuracyBarColor(row.accuracy) }">
              {{ row.accuracy }}%
            </span>
          </span>
          <span class="table-val">{{ formatTime(row.avgTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Session History Tab -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div v-if="sessions.length === 0" class="empty-state">
        <p>尚無練習記錄</p>
      </div>
      <div v-else class="session-list">
        <div v-for="(session, i) in reversedSessions" :key="i" class="session-item">
          <div class="session-left">
            <span class="session-date">{{ formatDate(session.date) }}</span>
            <span class="session-mode">{{ modeLabel(session.mode) }}</span>
          </div>
          <div class="session-right">
            <span class="session-accuracy" :style="{ color: accuracyBarColor(sessionAccuracy(session)) }">
              {{ sessionAccuracy(session) }}%
            </span>
            <span class="session-detail">{{ session.correct }}/{{ session.total }}</span>
            <span class="session-speed">{{ formatTime(session.avgTime) }}/題</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { displayChar } from '../data/kana'
import type { KanaStat, Session } from '../data/db'
import { db } from '../data/db'

const props = defineProps<{
  kanaStats: Record<string, KanaStat>
  sessions: Session[]
}>()

const emit = defineEmits<{ cleared: [] }>()

const activeTab = ref<'kana' | 'history'>('kana')
const sortBy = ref('accuracy-asc')

const tabs = [
  { id: 'kana' as const,    label: '假名統計' },
  { id: 'history' as const, label: '練習歷史' },
]

interface KanaStatRow {
  qualKey: string
  display: string
  attempts: number
  correct: number
  accuracy: number
  avgTime: number
}

const kanaStatRows = computed<KanaStatRow[]>(() =>
  Object.entries(props.kanaStats)
    .filter(([, s]) => s.attempts > 0)
    .map(([qualKey, s]) => ({
      qualKey,
      display: displayChar(qualKey),
      attempts: s.attempts,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.attempts) * 100),
      avgTime: Math.round(s.totalTime / s.attempts),
    }))
)

const sortedKanaStats = computed(() => {
  const rows = [...kanaStatRows.value]
  switch (sortBy.value) {
    case 'accuracy-asc':  return rows.sort((a, b) => a.accuracy - b.accuracy)
    case 'accuracy-desc': return rows.sort((a, b) => b.accuracy - a.accuracy)
    case 'attempts-desc': return rows.sort((a, b) => b.attempts - a.attempts)
    case 'speed-asc':     return rows.sort((a, b) => a.avgTime - b.avgTime)
    default: return rows
  }
})

const reversedSessions = computed(() => [...props.sessions].reverse())

function sessionAccuracy(s: Session): number {
  return s.total === 0 ? 0 : Math.round((s.correct / s.total) * 100)
}

function formatTime(ms: number): string {
  if (!ms) return '—'
  if (ms >= 1000) return (ms / 1000).toFixed(1) + 's'
  return ms + 'ms'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('zh-TW', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function modeLabel(mode: string): string {
  return { count: '題數', time: '計時', infinite: '無限' }[mode] ?? mode
}

function accuracyBarColor(pct: number): string {
  if (pct >= 80) return 'var(--success)'
  if (pct >= 50) return 'var(--accent)'
  return 'var(--error)'
}

async function exportData() {
  const json = await db.exportJSON()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gojuon-data.json'
  a.click()
  URL.revokeObjectURL(url)
}

function confirmClear() {
  if (window.confirm('確定要清除所有練習資料嗎？此操作無法復原。')) {
    db.clearAll().then(() => emit('cleared'))
  }
}
</script>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
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

.icon-btn:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.icon-btn.danger:hover {
  color: var(--error);
  border-color: var(--error);
}

.stats-tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--surface-2);
  padding: 0.25rem;
  border-radius: 0.5rem;
  align-self: flex-start;
}

.tab-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.35rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.tab-btn.active {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  color: var(--text);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.sort-select {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.3rem 0.6rem;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
}

.sort-select:focus {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}

.kana-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
  max-height: 440px;
  overflow-y: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 3rem 5rem 1fr 5rem;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface-2);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 3rem 5rem 1fr 5rem;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  align-items: center;
  border-top: 1px solid var(--border);
  transition: background 150ms;
}

.table-row:hover {
  background: var(--surface-hover);
}

.table-kana {
  font-size: 1.25rem;
  color: var(--text);
}

.table-val {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.table-accuracy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accuracy-bar-wrap {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
  max-width: 120px;
}

.accuracy-bar-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  transition: width 400ms ease;
}

.accuracy-pct {
  font-size: 0.8125rem;
  font-weight: 600;
  min-width: 3ch;
  font-variant-numeric: tabular-nums;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 440px;
  overflow-y: auto;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  border-radius: 0.4rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  gap: 1rem;
  flex-wrap: wrap;
}

.session-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.session-date {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.session-mode {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--surface-hover);
  color: var(--text-muted);
}

.session-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-accuracy {
  font-size: 1.125rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.session-detail {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.session-speed {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
