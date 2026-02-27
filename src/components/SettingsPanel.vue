<template>
  <div class="settings-panel">
    <h3 class="panel-title">設定</h3>

    <div class="settings-list">
      <!-- Practice Mode -->
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">練習模式</span>
        </div>
        <div class="mode-toggle">
          <button
            v-for="m in modes"
            :key="m.value"
            class="mode-btn"
            :class="{ active: settings.practiceMode === m.value }"
            @click="settings.practiceMode = m.value as any"
          >{{ m.label }}</button>
        </div>
      </div>

      <!-- Question Count (count mode) -->
      <div v-if="settings.practiceMode === 'count'" class="setting-item">
        <span class="setting-label">題目數量</span>
        <div class="number-input">
          <button class="num-btn" @click="adjust('questionCount', -5)">−</button>
          <span class="num-val">{{ settings.questionCount }}</span>
          <button class="num-btn" @click="adjust('questionCount', 5)">＋</button>
        </div>
      </div>

      <!-- Time Limit (time mode) -->
      <div v-if="settings.practiceMode === 'time'" class="setting-item">
        <span class="setting-label">時間限制</span>
        <div class="number-input">
          <button class="num-btn" @click="adjust('timeLimit', -10)">−</button>
          <span class="num-val">{{ settings.timeLimit }}秒</span>
          <button class="num-btn" @click="adjust('timeLimit', 10)">＋</button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="setting-item" v-for="toggle in toggles" :key="toggle.key">
        <div class="setting-info">
          <span class="setting-label">{{ toggle.label }}</span>
          <span class="setting-desc">{{ toggle.desc }}</span>
        </div>
        <button
          class="toggle-switch"
          :class="{ on: (settings as any)[toggle.key] }"
          @click="(settings as any)[toggle.key] = !(settings as any)[toggle.key]"
          :aria-label="toggle.label"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppSettings } from '../data/db'

const props = defineProps<{ settings: AppSettings }>()

const modes = [
  { value: 'count',    label: '題數' },
  { value: 'time',     label: '計時' },
  { value: 'infinite', label: '無限' },
]

const toggles: { key: keyof AppSettings; label: string; desc: string }[] = [
  { key: 'weightedRandom', label: '加權隨機', desc: '答錯次數越多的假名出現機率越高' },
  { key: 'autoAdvance',    label: '自動進題', desc: '輸入正確後自動進入下一題' },
  { key: 'showHint',       label: '顯示提示', desc: '題目下方顯示羅馬字提示' },
  { key: 'romajiVariants', label: '接受多種拼法', desc: '例如 si/shi、ti/chi 均接受' },
]

function adjust(key: 'questionCount' | 'timeLimit', delta: number) {
  const min = key === 'questionCount' ? 5 : 10
  const max = key === 'questionCount' ? 200 : 600
  props.settings[key] = Math.max(min, Math.min(max, props.settings[key] + delta))
}
</script>

<style scoped>
.settings-panel {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
}

.panel-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 0.9375rem;
  color: var(--text);
}

.setting-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mode-toggle {
  display: flex;
  gap: 0.2rem;
  background: var(--surface);
  padding: 0.2rem;
  border-radius: 0.4rem;
}

.mode-btn {
  padding: 0.3rem 0.65rem;
  border-radius: 0.3rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.mode-btn.active {
  background: var(--primary);
  color: #0c1a2a;
  font-weight: 600;
}

.mode-btn:hover:not(.active) {
  color: var(--text);
  background: var(--surface-hover);
}

.number-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.num-btn {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  transition: all 150ms;
  display: flex;
  align-items: center;
  justify-content: center;
}

.num-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.num-val {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
  min-width: 3.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.toggle-switch {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  transition: all 200ms;
  flex-shrink: 0;
}

.toggle-switch.on {
  background: var(--primary);
  border-color: var(--primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: all 200ms;
}

.toggle-switch.on .toggle-thumb {
  left: calc(100% - 18px);
  background: #0c1a2a;
}
</style>
