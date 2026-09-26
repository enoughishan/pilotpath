/**
 * Money formatting and percentage allocation utilities (en-IN number formatting)
 */

export function formatInr(amount: number): string {
  if (isNaN(amount)) return '₹0'
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

export function formatShort(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0'
  const lakhs = amount / 100000
  if (lakhs >= 100) {
    const crores = lakhs / 100
    return `₹${crores.toFixed(1).replace(/\.0$/, '')} crore`
  }
  return `₹${lakhs.toFixed(1).replace(/\.0$/, '')} lakh`
}

export function parseInr(input: string): number {
  if (!input) return 0
  const clean = input.replace(/[^0-9.]/g, '')
  const val = parseFloat(clean)
  if (isNaN(val)) return 0

  const lower = input.toLowerCase()
  if (lower.includes('crore') || lower.includes('cr')) {
    return Math.round(val * 10000000)
  }
  if (lower.includes('lakh') || lower.includes('l')) {
    return Math.round(val * 100000)
  }
  return Math.round(val)
}

/**
 * Largest-remainder method for allocating a total amount by percentages
 * so the parts always sum to the total exactly.
 */
export function allocate(totalAmount: number, percentages: number[]): number[] {
  const sumPct = percentages.reduce((a, b) => a + b, 0)
  if (sumPct === 0) return percentages.map(() => 0)

  const normalized = percentages.map((p) => (p / sumPct) * 100)
  const unrounded = normalized.map((p) => (totalAmount * p) / 100)
  const integerParts = unrounded.map((v) => Math.floor(v))
  const currentSum = integerParts.reduce((a, b) => a + b, 0)
  const remainderNeeded = Math.round(totalAmount - currentSum)

  const remainders = unrounded.map((v, i) => ({
    index: i,
    remainder: v - integerParts[i],
  }))

  // Sort descending by fractional remainder
  remainders.sort((a, b) => b.remainder - a.remainder)

  const result = [...integerParts]
  for (let i = 0; i < remainderNeeded && i < result.length; i++) {
    result[remainders[i].index] += 1
  }

  return result
}
