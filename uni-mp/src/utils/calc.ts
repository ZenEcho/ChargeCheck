export type Scheme = {
  id?: number
  val: number
  unit: 'A' | 'W'
  ep: number
  sp: number
}

export type ComputedScheme = Scheme & {
  id: number
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

export function computeResults(volt: number, amp: number, loss: number, schemes: Scheme[]): ComputedScheme[] {
  const v = volt || 0
  const ah = amp || 0
  const l = (loss || 0) / 100
  const netKwh = (v * ah) / 1000
  const inputKwh = l >= 1 ? 0 : netKwh / (1 - l)

  const computed = schemes.map((s) => {
    const pKw = s.unit === 'A' ? (s.val * v) / 1000 : s.val / 1000
    const time = pKw > 0 ? inputKwh / pKw : 0
    const hElec = pKw * s.ep
    const hServ = s.sp
    const hTotal = hElec + hServ
    const totalCost = inputKwh * s.ep + time * s.sp
    const realPrice = netKwh > 0 ? totalCost / netKwh : 0
    return {
      ...s,
      id: s.id ?? Date.now() + Math.floor(Math.random() * 1000),
      pKw,
      time,
      hElec,
      hServ,
      hTotal,
      totalCost,
      realPrice,
      isBest: false,
      isWorst: false,
      markup: 0
    }
  })

  const sorted = [...computed].sort((a, b) => a.realPrice - b.realPrice)
  return sorted.map((s, idx) => ({
    ...s,
    isBest: idx === 0 && sorted.length > 1,
    isWorst: idx === sorted.length - 1 && sorted.length > 1,
    markup: sorted.length > 1 && sorted[0] && sorted[0].realPrice !== 0 ? ((s.realPrice - sorted[0].realPrice) / sorted[0].realPrice * 100) : 0
  }))
}
