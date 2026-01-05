<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui'
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-indigo-50/50">
      <n-collapse arrow-placement="right">
        <n-collapse-item name="1">
          <template #header>
            <div class="font-bold text-gray-800 flex items-center gap-2">
              <span class="i-fluent-emoji-flat-open-book w-5 h-5"></span>
              使用说明与免责声明
            </div>
          </template>
          <div class="text-sm text-gray-600 space-y-4 pt-2">
            <div>
              <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-1">
                <span class="i-fluent-emoji-flat-rocket w-4 h-4"></span> 快速上手
              </h4>
              <ol class="list-decimal list-inside space-y-1 pl-1 text-xs md:text-sm">
                <li><b>设定基准</b>：输入你的电动车电池电压和容量。</li>
                <li><b>添加方案</b>：看到充电桩价格牌后，输入功率（或充电器电流）、电费单价和服务费。</li>
                <li><b>对比决策</b>：系统会自动计算“充满电”的总成本和每度电的真实成本，帮你找出最省钱的方案。</li>
              </ol>
            </div>
            
            <div>
              <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-1">
                <span class="i-fluent-emoji-flat-warning w-4 h-4"></span> 免责声明
              </h4>
              <p class="text-xs leading-relaxed text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                本工具仅提供理论计算参考。实际充电成本可能受到电池健康度（SOH）、环境温度、充电桩计量误差、线损及BMS均衡策略等多种物理因素影响。计算结果不作为交易依据，请以充电桩实际结算金额为准。
              </p>
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>

    <div class="text-center text-[10px] text-gray-300 pb-6">
      Designed for EV Riders · 
      <a href="https://github.com/ZenEcho/ChargeCheck" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">GitHub</a>
    </div>
  </div>
</template>
