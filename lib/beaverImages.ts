export const BEAVER_IMAGE_BASE = '/beavers'
export const BEAVER_IMAGE_SLUGS = [
  'lumber-loader',
  'snack-breaker',
  'campfire-buddy',
  'cozy-builder',
  'blueprint-brain',
  'dam-commander',
  'rainwatcher',
  'chaos-rodent',
  'cosmic-beaver',
  '3am-survivor',
  'beaver-king',
  'alchemist-beaver',
] as const

export type BeaverImageSlug = (typeof BEAVER_IMAGE_SLUGS)[number]

export function getBeaverImagePath(slug: string) {
  if (BEAVER_IMAGE_SLUGS.includes(slug as BeaverImageSlug)) {
    // use svg assets for lightweight placeholders
    return `${BEAVER_IMAGE_BASE}/${slug}.svg`
  }
  return `${BEAVER_IMAGE_BASE}/placeholder.svg`
}
