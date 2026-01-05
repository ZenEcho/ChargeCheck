<script setup lang="ts">
import { NGrid, NGridItem, NInputNumber, NTooltip } from 'naive-ui'

const props = defineProps<{
  volt: number
  amp: number
  loss: number
}>()

const emit = defineEmits<{
  (e: 'update:volt', value: number): void
  (e: 'update:amp', value: number): void
  (e: 'update:loss', value: number): void
}>()
</script>

<template>
  <div class="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-indigo-50/50">
    <div class="flex items-center gap-2 mb-4 md:mb-6 font-bold text-gray-800 text-base md:text-lg">
      <span class="i-fluent-emoji-flat-battery w-5 h-5 md:w-6 md:h-6"></span> 电池基础信息
    </div>
    <n-grid :x-gap="12" :y-gap="16" :cols="2">
      <n-grid-item>
        <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase">电池电压(V)</div>
        <n-input-number 
          :value="props.volt" 
          @update:value="(v) => emit('update:volt', v || 0)"
          :show-button="false" 
          placeholder="72" 
          size="large" 
        />
      </n-grid-item>
      <n-grid-item>
        <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase">容量(Ah)</div>
        <n-input-number 
          :value="props.amp" 
          @update:value="(v) => emit('update:amp', v || 0)"
          :show-button="false" 
          placeholder="20" 
          size="large" 
        />
      </n-grid-item>
      <n-grid-item :span="2">
        <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase flex items-center gap-1">
          损耗率(%)
          <n-tooltip trigger="click">
            <template #trigger>
              <span class="i-fluent-emoji-flat-information w-4 h-4 cursor-help opacity-60"></span>
            </template>
            充电过程中转化为热量的比例，通常在 5% - 15% 之间
          </n-tooltip>
        </div>
        <n-input-number 
          :value="props.loss" 
          @update:value="(v) => emit('update:loss', v || 0)"
          :show-button="false" 
          size="large" 
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>
