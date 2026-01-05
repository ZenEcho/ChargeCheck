<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NConfigProvider, NGlobalStyle, type GlobalThemeOverrides
} from 'naive-ui'
import AppHeader from './components/AppHeader.vue'
import BatteryForm from './components/BatteryForm.vue'
import SchemeForm from './components/SchemeForm.vue'
import ResultList from './components/ResultList.vue'
import AppFooter from './components/AppFooter.vue'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6359E9',
    borderRadius: '16px',
    fontSize: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
  },
  Input: {
    borderRadius: '12px',
    color: '#F9FAFB',
    fontSize: '14px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',
  }
}

// 基础状态
const volt = ref(48)
const amp = ref(20)
const loss = ref(0)

interface Scheme {
  id: number; val: number; unit: 'A' | 'W'; ep: number; sp: number;
}

const schemes = ref<Scheme[]>([
  // { id: 1, val: 5, unit: 'A', ep: 0.6, sp: 0.8 },
  // { id: 2, val: 2, unit: 'A', ep: 1.2, sp: 0.4 }
])

const addScheme = (scheme: Omit<Scheme, 'id'>) => {
  schemes.value.push({
    id: Date.now(),
    ...scheme
  })
}

const removeScheme = (id: number) => {
  schemes.value = schemes.value.filter(s => s.id !== id)
}

// 核心计算逻辑
const results = computed(() => {
  const v = volt.value || 0
  const ah = amp.value || 0
  const l = (loss.value || 0) / 100
  const netKwh = (v * ah) / 1000
  const inputKwh = l >= 1 ? 0 : netKwh / (1 - l)

  const computedSchemes = schemes.value.map(s => {
    const pKw = s.unit === 'A' ? (s.val * v) / 1000 : s.val / 1000
    const time = pKw > 0 ? inputKwh / pKw : 0
    
    // 每小时明细计算
    const hElec = pKw * s.ep // 每小时电费 = 功率 * 电费单价
    const hServ = s.sp      // 每小时服务费
    const hTotal = hElec + hServ
    
    const totalCost = inputKwh * s.ep + time * s.sp
    const realPrice = netKwh > 0 ? totalCost / netKwh : 0

    return { ...s, pKw, time, hElec, hServ, hTotal, totalCost, realPrice }
  })

  const sorted = [...computedSchemes].sort((a, b) => a.realPrice - b.realPrice)
  return sorted.map((s, idx) => ({
    ...s,
    isBest: idx === 0 && sorted.length > 1,
    isWorst: idx === sorted.length - 1 && sorted.length > 1,
    markup: sorted.length > 1 && sorted[0] && sorted[0].realPrice !== 0 ? ((s.realPrice - sorted[0].realPrice) / sorted[0].realPrice * 100) : 0
  }))
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-global-style />

    <div class="min-h-screen bg-[#F4F7FF] p-4 md:p-8 flex justify-center items-start font-sans">
      <div class="w-full max-w-lg space-y-4 md:space-y-6">
        
        <AppHeader />
        
        <BatteryForm 
          v-model:volt="volt" 
          v-model:amp="amp" 
          v-model:loss="loss" 
        />
        
        <SchemeForm @add="addScheme" />
        
        <ResultList :results="results" @remove="removeScheme" />
        
        <AppFooter />

      </div>
    </div>
  </n-config-provider>
</template>
