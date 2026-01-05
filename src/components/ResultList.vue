<script setup lang="ts">
import { NButton } from 'naive-ui'

interface ComputedScheme {
  id: number
  val: number
  unit: 'A' | 'W'
  ep: number
  sp: number
  pKw: number
  time: number
  hElec: number
  hServ: number
  hTotal: number
  totalCost: number
  realPrice: number
  isBest: boolean
  isWorst: boolean
  markup: number
}

defineProps<{
  results: ComputedScheme[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: number): void
}>()
</script>

<template>
  <div class="space-y-4">
    <transition-group name="list">
      <div v-for="item in results" :key="item.id" 
           class="bg-white rounded-[28px] overflow-hidden transition-all duration-300 border-2"
           :class="[
             item.isBest ? 'border-emerald-500 shadow-xl shadow-emerald-100' : 
             item.isWorst ? 'border-rose-500 shadow-xl shadow-rose-100' : 'border-white shadow-sm'
           ]">
        
        <div class="px-4 py-2 md:px-6 flex justify-between items-center" 
             :class="item.isBest ? 'bg-emerald-500 text-white' : (item.isWorst ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-400')">
          <span class="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-1">
            <span v-if="item.isBest" class="i-fluent-emoji-flat-crown w-4 h-4 block"></span>
            <span v-else-if="item.isWorst" class="i-fluent-emoji-flat-skull w-4 h-4 block"></span>
            {{ item.isBest ? '最优充电' : (item.isWorst ? '电费刺客' : '普通方案') }}
          </span>
          <span v-if="!item.isBest" class="text-xs md:text-sm font-bold">
            溢价: +{{ item.markup.toFixed(1) }}%
          </span>
        </div>

        <div class="p-4 md:p-6">
          <div class="flex justify-between items-end mb-6">
            <div>
              <div class="text-3xl md:text-4xl font-black tracking-tight flex items-baseline gap-1"
                   :class="item.isWorst ? 'text-rose-600' : 'text-gray-900'">
                {{ item.realPrice.toFixed(4) }}
                <span class="text-xs md:text-sm font-bold text-gray-400">元/度</span>
              </div>
              <div class="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">充电成本</div>
            </div>
            <div class="text-right">
              <div class="text-lg md:text-xl font-black text-gray-700">¥{{ item.totalCost.toFixed(2) }}</div>
              <div class="text-xs md:text-sm font-bold text-gray-400 uppercase">充满总费用</div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-3 md:p-4 mb-4 grid grid-cols-3 gap-2 text-center border border-gray-100">
            <div>
              <div class="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-1">每小时电费</div>
              <div class="text-xs md:text-sm font-mono font-bold text-gray-700">¥{{ item.hElec.toFixed(2) }}</div>
            </div>
            <div class="border-x border-gray-200">
              <div class="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-1">每小时服务</div>
              <div class="text-xs md:text-sm font-mono font-bold text-gray-700">¥{{ item.hServ.toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-[10px] md:text-xs font-black text-rose-400 uppercase mb-1">每小时总费</div>
              <div class="text-xs md:text-sm font-mono font-black text-rose-600">¥{{ item.hTotal.toFixed(2) }}</div>
            </div>
          </div>

          <div class="flex justify-between items-center text-xs md:text-sm font-bold text-gray-400">
            <div class="flex gap-2 md:gap-4 uppercase">
              <span>功率: {{ (item.pKw*1000).toFixed(0) }}W</span>
              <span>时长: {{ item.time.toFixed(2) }}h</span>
            </div>
            <n-button quaternary circle size="small" type="error" @click="emit('remove', item.id)">
              <template #icon><span class="i-fluent-emoji-flat-wastebasket"></span></template>
            </n-button>
          </div>
        </div>

        <div v-if="item.isWorst" class="bg-rose-50 px-4 md:px-6 py-2 text-rose-600 text-xs md:text-sm font-bold flex justify-between border-t border-rose-100">
          <span>⚠️ 每小时多收 ¥{{ (item.hTotal - (results[0]?.hTotal || 0)).toFixed(2) }}</span>
          <span>不建议</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
</style>
