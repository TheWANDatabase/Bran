import cache from "node-cache";

export const orgCache = new cache({
  // Cache cast resolve orgs for 24 hours
  stdTTL: 60 * 60 * 24
})

export const castCache = new cache({
  // Cache cast resolve cast members for 24 hours
  stdTTL: 60 * 60 * 24
})