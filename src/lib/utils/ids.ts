export const normalizeId = (s: string) =>
  s.toLowerCase().trim()
   .replace(/\s+/g, "-")
   .replace(/[^a-z0-9-]/g, "-")
   .replace(/-+/g, "-");