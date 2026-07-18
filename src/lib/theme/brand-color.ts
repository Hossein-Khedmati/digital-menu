function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [262, 83, 58]

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max  = Math.max(r, g, b)
  const min  = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6;               break
      case b: h = ((r - g) / d + 4) / 6;               break
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export type BrandShades = {
  subtle: string   // خیلی روشن برای background
  light:  string   // روشن برای hover/bg
  main:   string   // رنگ اصلی
  dark:   string   // تیره برای hover
}

// ── تولید شیدها از یک HEX ──
export function generateBrandShades(hex: string): BrandShades {
  // اعتبارسنجی
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex)
  const safeHex = isValid ? hex : '#9333ea'

  const [h, s] = hexToHsl(safeHex)

  return {
    subtle: hslToHex(h, Math.min(s, 30), 97),   // خیلی روشن
    light:  hslToHex(h, Math.min(s, 60), 92),   // روشن
    main:   safeHex,                             // اصلی
    dark:   hslToHex(h, s, Math.max(10, hexToHsl(safeHex)[2] - 12)), // تیره‌تر
  }
}

// ── ساخت CSS Variables string ──
export function buildBrandCssVars(hex: string): string {
  const shades = generateBrandShades(hex)
  return [
    `--brand-color:        ${shades.main};`,
    `--brand-color-light:  ${shades.light};`,
    `--brand-color-dark:   ${shades.dark};`,
    `--brand-color-subtle: ${shades.subtle};`,
  ].join('\n    ')
}