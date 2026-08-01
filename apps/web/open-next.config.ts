import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Incremental cache backed by R2 (binding NEXT_INC_CACHE_R2_BUCKET -> bucket
// "shiprhq-next-cache", declared in wrangler.jsonc).
//
// Deliberately MINIMAL. No `enableCacheInterception`, no `withRegionalCache`, no Durable
// Object sharded tag cache: that combination caused intermittent production 500s in a
// sibling project on this same stack. This marketing site is entirely prerendered, so the
// plain R2 incremental cache captures essentially all of the available win with none of
// that risk.
//
// If tag-based revalidation is ever needed here (it is not today - there is no
// revalidateTag call anywhere in this app), add the DO tag cache then, not pre-emptively.
export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});
