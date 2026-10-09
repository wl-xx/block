export function getPostUrl(relativePath: string) {
  return `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`
}
