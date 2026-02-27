<template>
  <div class="result">
    <div class="result-header">
      <h2 class="result-title">練習結果</h2>
    </div>

    <!-- Score hero -->
    <div class="score-hero">
      <div class="accuracy-ring">
        <svg viewBox="0 0 120 120" class="ring-svg">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" stroke-width="8"/>
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            :stroke="accuracyColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="ringDash"
            :stroke-dashoffset="ringOffset"
            transform="rotate(-90 60 60)"
            class="ring-progress"
          />
        </svg>
        <div class="ring-label">
          <span class="accuracy-pct">{{ accuracyPct }}%</span>
          <span class="accuracy-sub">正確率</span>
        </div>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <span class="stat-val">{{ result.total }}</span>
          <span class="stat-label">總題數</span>
        </div>
        <div class="stat-card correct">
          <span class="stat-val">{{ result.correct }}</span>
          <span class="stat-label">答對</span>
        </div>
        <div class="stat-card wrong">
          <span class="stat-val">{{ result.wrong }}</span>
          <span class="stat-label">答錯</span>
        </div>
        <div class="stat-card">
          <span class="stat-val">{{ formatTime(result.avgTime) }}</span>
          <span class="stat-label">平均用時</span>
        </div>
        <div v-if="result.fastestKana" class="stat-card">
          <span class="stat-val kana-val">{{ getKanaDisplay(result.fastestKana) }}</span>
          <span class="stat-label">最快假名</span>
        </div>
        <div v-if="result.slowestKana" class="stat-card">
          <span class="stat-val kana-val">{{ getKanaDisplay(result.slowestKana) }}</span>
          <span class="stat-label">最慢假名</span>
        </div>
      </div>
    </div>

    <!-- Wrong answers -->
    <div v-if="result.wrongAnswers.length > 0" class="wrong-section">
      <h3 class="section-title">答錯的假名</h3>
      <div class="wrong-grid">
        <div v-for="(wa, i) in result.wrongAnswers" :key="i" class="wrong-item">
          <div class="wrong-kana">{{ wa.kana.hiragana }}</div>
          <div class="wrong-details">
            <span class="wrong-input">你輸入：<code>{{ wa.userInput || '（空白）' }}</code></span>
            <span class="wrong-correct">正確：<code>{{ wa.kana.romaji.join(' / ') }}</code></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="result-actions">
      <button class="action-btn secondary" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        返回設定
      </button>
      <button class="action-btn primary" @click="emit('restart')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        再練一次
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KANA_TABLE } from '../data/kana'
import type { SessionResult } from './PracticeSession.vue'

const props = defineProps<{ result: SessionResult; script: 'hiragana' | 'katakana' | 'both' }>()
const emit = defineEmits<{ back: []; restart: [] }>()

const CIRCUMFERENCE = 2 * Math.PI * 52

const accuracyPct = computed(() =>
  props.result.total === 0 ? 0 : Math.round((props.result.correct / props.result.total) * 100)
)

const ringDash = computed(() => CIRCUMFERENCE)
const ringOffset = computed(() =>
  CIRCUMFERENCE * (1 - accuracyPct.value / 100)
)

const accuracyColor = computed(() => {
  const pct = accuracyPct.value
  if (pct >= 80) return 'var(--success)'
  if (pct >= 50) return 'var(--accent)'
  return 'var(--error)'
})

function formatTime(ms: number): string {
  if (ms >= 1000) return (ms / 1000).toFixed(1) + 's'
  return ms + 'ms'
}

function getKanaDisplay(key: string): string {
  const kana = KANA_TABLE.find(k => k.key === key)
  if (!kana) return key
  return props.script === 'katakana' ? kana.katakana : kana.hiragana
}
</script>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.score-hero {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.accuracy-ring {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-progress {
  transition: stroke-dashoffset 600ms ease;
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.accuracy-pct {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}

.accuracy-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  flex: 1;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  min-width: 5rem;
}

.stat-card.correct { border-color: color-mix(in srgb, var(--success) 40%, transparent); }
.stat-card.wrong   { border-color: color-mix(in srgb, var(--error) 40%, transparent); }

.stat-val {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.kana-val {
  font-size: 1.75rem;
}

.stat-card.correct .stat-val { color: var(--success); }
.stat-card.wrong   .stat-val { color: var(--error); }

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.wrong-section {}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.75rem;
}

.wrong-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.wrong-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
  background: color-mix(in srgb, var(--error) 8%, var(--surface-2));
  border: 1px solid color-mix(in srgb, var(--error) 20%, transparent);
}

.wrong-kana {
  font-size: 1.75rem;
  line-height: 1;
  width: 2.5rem;
  text-align: center;
  flex-shrink: 0;
}

.wrong-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.wrong-input, .wrong-correct {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.wrong-correct {
  color: var(--text);
}

code {
  font-family: 'Courier New', monospace;
  background: var(--surface-2);
  padding: 0 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: var(--primary);
}

.result-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.action-btn.secondary {
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
}

.action-btn.secondary:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.action-btn.primary {
  border: none;
  background: var(--primary);
  color: #0c1a2a;
}

.action-btn.primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--primary) 35%, transparent);
}
</style>
