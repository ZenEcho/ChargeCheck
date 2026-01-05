<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center py-2 mb-2">
    <div class="relative w-16 h-16 mb-3 group">
      <!-- Logo SVG -->
      <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-xl transition-transform transform group-hover:scale-105 duration-300">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6359E9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- 背景圆角矩形 -->
        <rect x="10" y="10" width="80" height="80" rx="24" fill="url(#logoGradient)" />
        <!-- 自行车轮廓意象 -->
        <circle cx="35" cy="65" r="12" stroke="white" stroke-width="6" fill="none" opacity="0.9" />
        <circle cx="75" cy="65" r="8" stroke="white" stroke-width="6" fill="none" opacity="0.9" />
        <!-- 闪电连接车身 -->
        <path d="M35 65 L55 35 L50 35 L65 15 L60 45 L65 45 L45 75" fill="white" stroke="white" stroke-width="4" stroke-linejoin="round" />
      </svg>
    </div>
    <h1 class="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
      充电费率<span class="text-[#6359E9]">一眼查</span>
    </h1>
    <p class="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase mt-1">
      计算每一度电的真实成本
    </p>
  </div>
</template>
