import { describe, it, expect } from 'vitest'
import { buildSchedule } from '@/components/LoanCalculator'

const identity = (n: number) => String(n)

describe('buildSchedule', () => {
  it('returns empty array for invalid inputs', () => {
    expect(buildSchedule('', '', '', identity)).toEqual([])
    expect(buildSchedule('0', '7.5', '10', identity)).toEqual([])
    expect(buildSchedule('100000', '0', '10', identity)).toEqual([])
    expect(buildSchedule('100000', '7.5', '0', identity)).toEqual([])
    expect(buildSchedule('abc', '7.5', '10', identity)).toEqual([])
  })

  it('produces correct number of rows (tenure * 12)', () => {
    const rows = buildSchedule('100000', '12', '1', identity)
    expect(rows).toHaveLength(12)

    const rows5yr = buildSchedule('500000', '8', '5', identity)
    expect(rows5yr).toHaveLength(60)
  })

  it('month numbers are sequential starting from 1', () => {
    const rows = buildSchedule('100000', '12', '2', identity)
    rows.forEach((row, i) => expect(row.month).toBe(i + 1))
  })

  it('calculates correct EMI for a known loan', () => {
    // 100,000 at 12% for 1 year → monthly rate 1%, EMI ≈ 8884.88
    const rows = buildSchedule('100000', '12', '1', (n) => n.toFixed(2))
    const emi = parseFloat(rows[0].emi)
    expect(emi).toBeCloseTo(8884.88, 1)
  })

  it('final balance is approximately zero', () => {
    const rows = buildSchedule('200000', '9', '3', identity)
    const finalBalance = parseFloat(rows[rows.length - 1].balance)
    expect(Math.abs(finalBalance)).toBeLessThan(0.01)
  })

  it('each row: principal + interest ≈ emi', () => {
    const rows = buildSchedule('300000', '8.5', '10', identity)
    for (const row of rows) {
      const emi = parseFloat(row.emi)
      const principal = parseFloat(row.principal)
      const interest = parseFloat(row.interest)
      expect(principal + interest).toBeCloseTo(emi, 5)
    }
  })

  it('interest decreases and principal increases over time', () => {
    const rows = buildSchedule('500000', '10', '5', identity)
    for (let i = 1; i < rows.length; i++) {
      expect(parseFloat(rows[i].interest)).toBeLessThan(parseFloat(rows[i - 1].interest))
      expect(parseFloat(rows[i].principal)).toBeGreaterThan(parseFloat(rows[i - 1].principal))
    }
  })

  it('balance decreases each month', () => {
    const rows = buildSchedule('100000', '7', '2', identity)
    for (let i = 1; i < rows.length; i++) {
      expect(parseFloat(rows[i].balance)).toBeLessThan(parseFloat(rows[i - 1].balance))
    }
  })

  it('sum of all principal payments ≈ original loan amount', () => {
    const principal = 250000
    const rows = buildSchedule(String(principal), '11', '4', identity)
    const totalPrincipal = rows.reduce((sum, row) => sum + parseFloat(row.principal), 0)
    expect(totalPrincipal).toBeCloseTo(principal, 0)
  })

  it('$ sign is placed before the amount in all columns (emi, principal, interest, balance) — used as-is in PDF and Excel exports', () => {
    const usdFmt = (n: number) => Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
    const usd = /^\$[\d,]+\.\d{2}$/
    const rows = buildSchedule('100000', '12', '1', usdFmt)
    for (const row of rows) {
      expect(row.emi).toMatch(usd)
      expect(row.principal).toMatch(usd)
      expect(row.interest).toMatch(usd)
      expect(row.balance).toMatch(usd)
    }
  })

  it('EMI ≈ ₹50,488.34 for ₹61,50,000 at 7.75% over 20 years', () => {
    const rows = buildSchedule('6150000', '7.75', '20', identity)
    const emi = parseFloat(rows[0].emi)
    expect(emi).toBeCloseTo(50488.34, 2)
  })
})
