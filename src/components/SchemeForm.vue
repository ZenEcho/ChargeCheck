<script setup lang="ts">
import { ref } from 'vue'
import { NGrid, NGridItem, NInputNumber, NSelect, NButton, NTooltip } from 'naive-ui'

const props = defineProps<{
  hasResults?: boolean
}>()

const emit = defineEmits<{
  (e: 'add', scheme: { val: number, unit: 'A' | 'W', ep: number, sp: number }): void
}>()

// 输入表单状态
const newPVal = ref<number | null>(null)
const newPUnit = ref<'A' | 'W'>('A')
const newEp = ref(0.6)
const newSp = ref(0.5)

const unitOptions = [
  { label: '安培(A)', value: 'A' },
  { label: '瓦特(W)', value: 'W' }
]

const handleAdd = () => {
  if (newPVal.value !== null) {
    emit('add', {
      val: newPVal.value,
      unit: newPUnit.value,
      ep: newEp.value,
      sp: newSp.value
    })
    newPVal.value = null
  }
}
</script>

<template>
  <div class="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-indigo-50/50">
    <div class="flex items-center gap-2 mb-4 md:mb-6 font-bold text-gray-800 text-base md:text-lg">
      <span class="i-fluent-emoji-flat-label w-5 h-5 md:w-6 md:h-6"></span> 充电桩信息
    </div>
    <div class="space-y-4">
      <div class="flex gap-3">
        <div class="flex-1">
          <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase flex items-center gap-1">
            功率/电流出力
            <n-tooltip trigger="click">
              <template #trigger>
                <span class="i-fluent-emoji-flat-information w-4 h-4 cursor-help opacity-60"></span>
              </template>
              <div class="text-xs">
                <p class="mb-2">💡 <b>如何选择单位？</b></p>
                <p class="mb-1">• <b>安培(A)</b>：查看充电器背面标签<br><span class="opacity-75">如 "Output: 48V 5A"，则填 5 选 A</span></p>
                <p>• <b>瓦特(W)</b>：如果你会查看充电桩屏幕显示的实时功率<br><span class="opacity-75">如 "500W"，则填 500 选 W</span></p>
              </div>
            </n-tooltip>
          </div>
          <n-input-number v-model:value="newPVal" placeholder="数值" :show-button="false" size="large" />
          <div class="text-[10px] text-gray-400 mt-1 pl-1">
            普通充电器填电流(A)，充电桩填功率(W)
          </div>
        </div>
        <div class="w-28 md:w-32">
          <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase opacity-0">单位</div>
          <n-select v-model:value="newPUnit" :options="unitOptions" size="large" />
        </div>
      </div>
      <n-grid :x-gap="12" :cols="2">
        <n-grid-item>
          <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase">电费(元/度)</div>
          <n-input-number v-model:value="newEp" :show-button="false" size="large" />
        </n-grid-item>
        <n-grid-item>
          <div class="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase">服务费(元/h)</div>
          <n-input-number v-model:value="newSp" :show-button="false" size="large" />
        </n-grid-item>
      </n-grid>
      <n-button block type="primary" size="large" @click="handleAdd" class="h-10 md:h-12 font-bold text-sm md:text-base shadow-lg shadow-indigo-200">
        {{ props.hasResults ? '添加更多信息' : '查看电费' }}
      </n-button>
    </div>
  </div>
</template>
