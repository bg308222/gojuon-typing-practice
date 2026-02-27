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
              <label
                v-for="kana in getRowKana(rowId)"
                :key="kana.key"
                class="kana-cell"
                :class="{ selected: isKanaSelected(kana.key) }"
                :title="kana.romaji.join(' / ')"
              >
                <input
                  type="checkbox"
                  :checked="isKanaSelected(kana.key)"
                  @change="toggleKana(kana.key)"
                />
                <span class="kana-char hira">{{ kana.hiragana }}</span>
                <span class="kana-char kata">{{ kana.katakana }}</span>
                <span class="kana-romaji">{{ kana.romaji[0] }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KANA_TABLE, ROW_GROUPS, ROW_LABELS, type KanaEntry } from '../data/kana'
import type { AppSettings } from '../data/db'

const props = defineProps<{ settings: AppSettings }>()

function getRowKana(rowId: string): KanaEntry[] {
  return KANA_TABLE.filter(k => k.row === rowId)
}

const selectedSet = computed(() => new Set(props.settings.selectedKana))

function isKanaSelected(key: string): boolean {
  return selectedSet.value.has(key)
}

function isRowSelected(rowId: string): boolean {
  const kana = getRowKana(rowId)
  return kana.length > 0 && kana.every(k => selectedSet.value.has(k.key))
}

function isRowIndeterminate(rowId: string): boolean {
  const kana = getRowKana(rowId)
  const some = kana.some(k => selectedSet.value.has(k.key))
  const all  = kana.every(k => selectedSet.value.has(k.key))
  return some && !all
}

function isGroupSelected(group: typeof ROW_GROUPS[0]): boolean {
  return group.rows.every(r => isRowSelected(r))
}

function isGroupIndeterminate(group: typeof ROW_GROUPS[0]): boolean {
  const some = group.rows.some(r => {
    const kana = getRowKana(r)
    return kana.some(k => selectedSet.value.has(k.key))
  })
  return some && !isGroupSelected(group)
}

function toggleKana(key: string) {
  const list = [...props.settings.selectedKana]
  const idx = list.indexOf(key)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(key)
  props.settings.selectedKana = list
}

function toggleRow(rowId: string) {
  const kana = getRowKana(rowId)
  const allSelected = kana.every(k => selectedSet.value.has(k.key))
  const list = new Set(props.settings.selectedKana)
  if (allSelected) {
    kana.forEach(k => list.delete(k.key))
  } else {
    kana.forEach(k => list.add(k.key))
  }
  props.settings.selectedKana = [...list]
}

function toggleGroup(group: typeof ROW_GROUPS[0]) {
  const allSelected = isGroupSelected(group)
  const list = new Set(props.settings.selectedKana)
  group.rows.forEach(rowId => {
    getRowKana(rowId).forEach(k => {
      if (allSelected) list.delete(k.key)
      else list.add(k.key)
    })
  })
  props.settings.selectedKana = [...list]
}

function selectAll() {
  props.settings.selectedKana = KANA_TABLE.map(k => k.key)
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
  gap: 0.4rem;
}

.kana-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3.25rem;
  padding: 0.35rem 0.25rem 0.3rem;
  border-radius: 0.4rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  cursor: pointer;
  transition: all 150ms;
  position: relative;
  gap: 0;
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
  font-size: 1rem;
  line-height: 1.25;
  color: var(--text);
}

.kana-char.hira {
  font-family: 'Noto Serif JP', serif;
}

.kana-char.kata {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.kana-cell.selected .kana-char.hira {
  color: var(--primary);
}

.kana-cell.selected .kana-char.kata {
  color: var(--primary-light);
}

.kana-romaji {
  font-size: 0.5625rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.02em;
}

</style>
