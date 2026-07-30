import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Incremental cache backed by R2 (binding NEXT_INC_CACHE_R2_BUCKET -> bucket
// "buildrhq-next-cache", declared in wrangler.jsonc). The bucket is shared across the
// monorepo; NEXT_INC_CACHE_R2_PREFIX in wrangler.jsonc namespaces this app's entries.
//
// Deliberately MINIMAL. No `enableCacheInterception`, no `withRegionalCache`, no Durable
// Object sharded tag cache: that combination caused intermittent production 500s on this
// same stack in a sibling project. Add the DO tag cache only if this app actually starts
// using tag-based revalidation.
export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});
