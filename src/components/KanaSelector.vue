<template>
  <div class="selector">
    <div class="selector-header">
      <h2 class="selector-title">選擇練習範圍</h2>
      <div class="quick-actions">
        <button class="action-btn" @click="selectAll">全選</button>
        <button class="action-btn" @click="clearAll">清除</button>
      </div>
    </div>

    <div class="kana-groups">
      <div v-for="group in ROW_GROUPS" :key="group.id" class="kana-group">
        <div class="group-header">
          <label class="group-label">
            <input
              type="checkbox"
              :checked="isGroupSelected(group)"
              :indeterminate="isGroupIndeterminate(group)"
              @change="toggleGroup(group)"
            />
            {{ group.label }}
          </label>
        </div>

        <div class="rows-grid">
          <div v-for="rowId in group.rows" :key="rowId" class="row-block">
            <label class="row-label">
              <input
                type="checkbox"
                :checked="isRowSelected(rowId)"
                :indeterminate="isRowIndeterminate(rowId)"
                @change="toggleRow(rowId)"
              />
              <span class="row-name">{{ ROW_LABELS[rowId] }}</span>
            </label>
            <div class="kana-cells">
              <div
                v-for="kana in getRowKana(rowId)"
                :key="kana.key"
                class="kana-pair"
                :title="kana.romaji.join(' / ')"
              >
                <!-- 平假名 -->
                <label
                  class="kana-cell"
                  :class="{ selected: isSelected(kana.key, 'h') }"
                >
                  <input type="checkbox" :checked="isSelected(kana.key, 'h')" @change="toggle(kana.key, 'h')" />
                  <span class="kana-char">{{ kana.hiragana }}</span>
                  <span class="kana-script-tag">平</span>
                </label>
                <!-- 片假名 -->
                <label
                  class="kana-cell"
                  :class="{ selected: isSelected(kana.key, 'k') }"
                >
                  <input type="checkbox" :checked="isSelected(kana.key, 'k')" @change="toggle(kana.key, 'k')" />
                  <span class="kana-char kata">{{ kana.katakana }}</span>
                  <span class="kana-script-tag">片</span>
                </label>
                <!-- romaji label -->
                <span class="kana-romaji">{{ kana.romaji[0] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KANA_TABLE, ROW_GROUPS, ROW_LABELS, toHiraKey, toKataKey, type KanaEntry } from '../data/kana'
import type { AppSettings } from '../data/db'

const props = defineProps<{ settings: AppSettings }>()

function getRowKana(rowId: string): KanaEntry[] {
  return KANA_TABLE.filter(k => k.row === rowId)
}

const selectedSet = computed(() => new Set(props.settings.selectedKana))

function isSelected(baseKey: string, script: 'h' | 'k'): boolean {
  const qualKey = script === 'h' ? toHiraKey(baseKey) : toKataKey(baseKey)
  return selectedSet.value.has(qualKey)
}

function toggle(baseKey: string, script: 'h' | 'k') {
  const qualKey = script === 'h' ? toHiraKey(baseKey) : toKataKey(baseKey)
  const list = [...props.settings.selectedKana]
  const idx = list.indexOf(qualKey)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(qualKey)
  props.settings.selectedKana = list
}

// Row-level: checks both h and k keys for all kana in row
function isRowSelected(rowId: string): boolean {
  const kana = getRowKana(rowId)
  return kana.length > 0 && kana.every(k =>
    selectedSet.value.has(toHiraKey(k.key)) && selectedSet.value.has(toKataKey(k.key))
  )
}

function isRowIndeterminate(rowId: string): boolean {
  const kana = getRowKana(rowId)
  const anySelected = kana.some(k =>
    selectedSet.value.has(toHiraKey(k.key)) || selectedSet.value.has(toKataKey(k.key))
  )
  return anySelected && !isRowSelected(rowId)
}

function toggleRow(rowId: string) {
  const kana = getRowKana(rowId)
  const allSelected = isRowSelected(rowId)
  const list = new Set(props.settings.selectedKana)
  kana.forEach(k => {
    const hk = toHiraKey(k.key)
    const kk = toKataKey(k.key)
    if (allSelected) { list.delete(hk); list.delete(kk) }
    else { list.add(hk); list.add(kk) }
  })
  props.settings.selectedKana = [...list]
}

function isGroupSelected(group: typeof ROW_GROUPS[0]): boolean {
  return group.rows.every(r => isRowSelected(r))
}

function isGroupIndeterminate(group: typeof ROW_GROUPS[0]): boolean {
  const some = group.rows.some(r => {
    const kana = getRowKana(r)
    return kana.some(k =>
      selectedSet.value.has(toHiraKey(k.key)) || selectedSet.value.has(toKataKey(k.key))
    )
  })
  return some && !isGroupSelected(group)
}

function toggleGroup(group: typeof ROW_GROUPS[0]) {
  const allSelected = isGroupSelected(group)
  const list = new Set(props.settings.selectedKana)
  group.rows.forEach(rowId => {
    getRowKana(rowId).forEach(k => {
      const hk = toHiraKey(k.key)
      const kk = toKataKey(k.key)
      if (allSelected) { list.delete(hk); list.delete(kk) }
      else { list.add(hk); list.add(kk) }
    })
  })
  props.settings.selectedKana = [...list]
}

function selectAll() {
  const all: string[] = []
  KANA_TABLE.forEach(k => { all.push(toHiraKey(k.key)); all.push(toKataKey(k.key)) })
  props.settings.selectedKana = all
}

function clearAll() {
  props.settings.selectedKana = []
}
</script>

<style scoped>
.selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.selector-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.kana-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.group-header {
  margin-bottom: 0.75rem;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
}

.group-label input[type="checkbox"] {
  accent-color: var(--primary);
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.rows-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1.25rem;
}

.row-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: 0.4rem;
}

.row-label input[type="checkbox"] {
  accent-color: var(--primary);
  width: 0.875rem;
  height: 0.875rem;
  cursor: pointer;
}

.row-name {
  font-size: 0.8125rem;
}

.kana-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* One sound = a pair of two cells stacked + romaji below */
.kana-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.kana-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2.75rem;
  padding: 0.3rem 0.2rem 0.2rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  cursor: pointer;
  transition: all 150ms;
  position: relative;
  gap: 0.1rem;
}

.kana-cell input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.kana-cell:hover {
  border-color: var(--primary);
}

.kana-cell.selected {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 15%, var(--surface-2));
}

.kana-char {
  font-size: 1.125rem;
  line-height: 1.2;
  color: var(--text);
  font-family: 'Noto Serif JP', serif;
}

.kana-char.kata {
  font-family: 'Noto Sans JP', sans-serif;
  color: var(--text-muted);
}

.kana-cell.selected .kana-char {
  color: var(--primary);
}

.kana-cell.selected .kana-char.kata {
  color: var(--primary-light);
}

.kana-script-tag {
  font-size: 0.5rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
  line-height: 1;
}

.kana-cell.selected .kana-script-tag {
  color: color-mix(in srgb, var(--primary) 70%, var(--text-muted));
}

.kana-romaji {
  font-size: 0.5625rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.02em;
}
</style>
