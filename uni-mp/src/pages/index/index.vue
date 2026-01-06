<template>
  <view class="page">
    <view class="header">
      <image class="logo" src="/static/logo.png" />
      <text class="title">电动车充电一眼查</text>
      <text class="subtitle">计算每一度电的真实成本</text>
    </view>

    <view class="card">
      <text class="card-title">电池基础信息</text>
      <view class="form-row">
        <text class="label">电压(V)</text>
        <input class="input" type="digit" :value="volt" @input="onVoltInput" placeholder="48" />
      </view>
      <view class="form-row">
        <text class="label">容量(Ah)</text>
        <input class="input" type="digit" :value="amp" @input="onAmpInput" placeholder="20" />
      </view>
      <view class="form-row">
        <text class="label">损耗率(%)</text>
        <input class="input" type="digit" :value="loss" @input="onLossInput" placeholder="10" />
      </view>
    </view>

    <view class="card">
      <text class="card-title">充电桩信息</text>
      <view class="form-row">
        <text class="label">功率/电流</text>
        <input class="input" type="digit" :value="newPVal" @input="onPValInput" placeholder="500 或 5" />
        <picker mode="selector" :range="unitRange" :value="unitIndex" @change="onUnitChange">
          <view class="picker">{{ unitRange[unitIndex] }}</view>
        </picker>
      </view>
      <view class="help">
        普通充电器填电流(A)，充电桩填功率(W)。如何选择单位：安培(A) 查看充电器标签如“Output: 48V 5A”；瓦特(W) 查看充电桩屏幕实时功率如“500W”。
      </view>
      <view class="form-row">
        <text class="label">电费(元/度)</text>
        <input class="input" type="digit" :value="newEp" @input="onEpInput" placeholder="0.6" />
      </view>
      <view class="form-row">
        <text class="label">服务费(元/h)</text>
        <input class="input" type="digit" :value="newSp" @input="onSpInput" placeholder="0.5" />
      </view>
      <button class="btn" @click="handleAdd">{{ buttonText }}</button>
    </view>

    <view class="list">
      <view v-for="item in results" :key="item.id" class="result-card" :class="item.isWorst ? 'worst' : (item.isBest ? 'best' : '')">
        <view class="result-header" :class="item.isWorst ? 'worst' : (item.isBest ? 'best' : '')">
          <text class="tag">{{ item.isBest ? '最优充电' : (item.isWorst ? '电费刺客' : '普通方案') }}</text>
          <text v-if="!item.isBest" class="markup">溢价: +{{ item.markup.toFixed(1) }}%</text>
        </view>
        <view class="result-body">
          <view class="left">
            <view class="price">{{ item.realPrice.toFixed(4) }}</view>
            <text class="unit">元/度</text>
            <text class="label-sm">充电成本</text>
          </view>
          <view class="right">
            <text class="total">¥{{ item.totalCost.toFixed(2) }}</text>
            <text class="label-sm">充满总费用</text>
          </view>
        </view>
        <view class="metrics">
          <view class="metric">
            <text class="metric-label">每小时电费</text>
            <text class="metric-val">¥{{ item.hElec.toFixed(2) }}</text>
          </view>
          <view class="metric">
            <text class="metric-label">每小时服务</text>
            <text class="metric-val">¥{{ item.hServ.toFixed(2) }}</text>
          </view>
          <view class="metric">
            <text class="metric-label red">每小时总费</text>
            <text class="metric-val red">¥{{ item.hTotal.toFixed(2) }}</text>
          </view>
        </view>
        <view class="footer">
          <text class="info">功率: {{ (item.pKw*1000).toFixed(0) }}W</text>
          <text class="info">时长: {{ item.time.toFixed(2) }}h</text>
          <button class="remove" @click="remove(item.id)">删除</button>
        </view>
        <view v-if="item.isWorst" class="warning">
          <text>每小时多收 ¥{{ (item.hTotal - (results[0]?.hTotal || 0)).toFixed(2) }}</text>
          <text>不建议</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">使用说明与免责声明</text>
      <view class="section">
        <text class="section-title">快速上手</text>
        <view class="ol">
          <text class="li">1. 设定基准：输入你的电动车电池电压和容量。</text>
          <text class="li">2. 添加方案：看到充电桩价格牌后，输入功率（或充电器电流）、电费单价和服务费。</text>
          <text class="li">3. 对比决策：系统会自动计算“充满电”的总成本和每度电的真实成本，帮你找出最省钱的方案。</text>
        </view>
      </view>
      <view class="section">
        <text class="section-title">免责声明</text>
        <text class="desc">本工具仅提供理论计算参考。实际充电成本可能受到电池健康度（SOH）、环境温度、充电桩计量误差、线损及BMS均衡策略等多种物理因素影响。计算结果不作为交易依据，请以充电桩实际结算金额为准。</text>
      </view>
    </view>

    <view class="repo">
      <text class="repo-text">项目地址：</text>
      <text class="repo-link">https://github.com/ZenEcho/ChargeCheck</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { computeResults, type Scheme, type ComputedScheme } from '../../utils/calc'

const volt = ref('48')
const amp = ref('20')
const loss = ref('0')

const schemes = ref<Scheme[]>([])

const onVoltInput = (e: any) => { volt.value = e.detail.value }
const onAmpInput = (e: any) => { amp.value = e.detail.value }
const onLossInput = (e: any) => { loss.value = e.detail.value }

const unitRange = ['安培(A)', '瓦特(W)']
const unitIndex = ref(0)
const newPUnit = computed(() => unitIndex.value === 0 ? 'A' : 'W')

const newPVal = ref('')
const newEp = ref('0.6')
const newSp = ref('0.5')

const onPValInput = (e: any) => { newPVal.value = e.detail.value }
const onEpInput = (e: any) => { newEp.value = e.detail.value }
const onSpInput = (e: any) => { newSp.value = e.detail.value }
const onUnitChange = (e: any) => { unitIndex.value = Number(e.detail.value || 0) }

const handleAdd = () => {
  if (newPVal.value !== '') {
    schemes.value.push({
      id: Date.now(),
      val: Number(newPVal.value),
      unit: newPUnit.value as 'A' | 'W',
      ep: Number(newEp.value),
      sp: Number(newSp.value)
    })
    newPVal.value = ''
  }
}

const results = computed<ComputedScheme[]>(() => computeResults(Number(volt.value), Number(amp.value), Number(loss.value), schemes.value))

const buttonText = computed(() => results.value.length > 0 ? '添加更多信息' : '查看电费')

const remove = (id: number) => {
  schemes.value = schemes.value.filter(s => (s as any).id !== id)
}

onShareAppMessage(() => ({
  title: '电动车充电一眼查',
  path: '/pages/index/index',
  imageUrl: '/static/logo.png'
}))

onShareTimeline(() => ({
  title: '电动车充电一眼查'
}))
</script>

<style>
.page { padding: 24rpx; background-color: #F4F7FF; min-height: 100vh; }
.header { align-items: center; display: flex; flex-direction: column; margin-bottom: 32rpx; }
.logo { height: 128rpx; width: 128rpx; margin-bottom: 12rpx; }
.title { font-size: 40rpx; font-weight: 800; color: #111827; }
.subtitle { font-size: 22rpx; color: #6b7280; margin-top: 8rpx; }
.card { background-color: #fff; border-radius: 32rpx; padding: 24rpx; margin: 12px 0px; }
.card-title { font-size: 28rpx; font-weight: 700; color: #111827; margin-bottom: 16rpx; }
.form-row { display: flex; align-items: center; gap: 16rpx; margin-bottom: 16rpx; }
.label { width: 200rpx; font-size: 24rpx; color: #6b7280; }
.input { flex: 1; height: 72rpx; border-radius: 24rpx; background-color: #F9FAFB; padding: 0 24rpx; font-size: 28rpx; }
.picker { width: 160rpx; height: 72rpx; border-radius: 24rpx; background-color: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; }
.help { font-size: 20rpx; color: #9CA3AF; margin-bottom: 16rpx; padding-left: 8rpx; }
.btn { width: 100%; height: 88rpx; border-radius: 28rpx; background-color: #6359E9; color: #fff; font-weight: 700; font-size: 30rpx; }
.list { display: flex; flex-direction: column; gap: 16rpx; }
.result-card { background-color: #fff; border-radius: 36rpx; overflow: hidden; border-width: 4rpx; border-style: solid; border-color: #ffffff; }
.result-card.best { border-color: #10B981; }
.result-card.worst { border-color: #EF4444; }
.result-header { padding: 16rpx 24rpx; display: flex; justify-content: space-between; align-items: center; }
.result-header.best { background-color: #10B981; color: #fff; }
.result-header.worst { background-color: #EF4444; color: #fff; }
.tag { font-size: 22rpx; font-weight: 900; letter-spacing: 2rpx; }
.markup { font-size: 22rpx; font-weight: 700; }
.result-body { padding: 24rpx; display: flex; justify-content: space-between; align-items: flex-end; }
.price { font-size: 56rpx; font-weight: 900; color: #111827; }
.unit { font-size: 22rpx; color: #9CA3AF; margin-left: 8rpx; }
.label-sm { font-size: 22rpx; color: #9CA3AF; margin-top: 8rpx; }
.total { font-size: 40rpx; font-weight: 800; color: #374151; text-align: right; }
.metrics { background-color: #F9FAFB; border-radius: 24rpx; padding: 16rpx; margin: 16rpx 24rpx; display: flex; justify-content: space-between; }
.metric { width: 33.33%; align-items: center; display: flex; flex-direction: column; }
.metric-label { font-size: 20rpx; color: #9CA3AF; margin-bottom: 8rpx; }
.metric-val { font-size: 24rpx; color: #374151; font-weight: 700; }
.metric-label.red { color: #F87171; }
.metric-val.red { color: #EF4444; font-weight: 800; }
.footer { padding: 24rpx; display: flex; justify-content: space-between; align-items: center; font-size: 24rpx; color: #6b7280; }
.info { margin-right: 16rpx; }
.remove { height: 64rpx; padding: 0 24rpx; border-radius: 24rpx; background-color: #EF4444; color: #fff; font-size: 24rpx; }
.warning { background-color: #FEF2F2; color: #EF4444; padding: 16rpx 24rpx; display: flex; justify-content: space-between; font-size: 24rpx; }
.section { margin-top: 16rpx; }
.section-title { font-size: 26rpx; font-weight: 700; color: #111827; margin-bottom: 12rpx; display: flex; align-items: center; gap: 8rpx; }
.ol { display: flex; flex-direction: column; gap: 8rpx; }
.li { font-size: 22rpx; color: #6b7280; }
.desc { font-size: 22rpx; line-height: 48rpx; color: #6b7280; padding: 16rpx;  word-break: break-word; }
.repo { padding: 24rpx 0 48rpx; text-align: center; color: #9CA3AF; font-size: 22rpx; }
.repo-link { color: #4F46E5; }
</style>
