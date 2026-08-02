import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Cloudflare Workers deploy config for the ShipItHQ app (app.shipithq.com).
//
// Incremental cache backed by R2 (binding NEXT_INC_CACHE_R2_BUCKET -> bucket
// "shipithq-next-cache", declared in wrangler.jsonc, namespaced by
// NEXT_INC_CACHE_R2_PREFIX so it can share that bucket with apps/web).
//
// Deliberately MINIMAL, matching apps/web. No `enableCacheInterception`, no
// `withRegionalCache`, no Durable Object sharded tag cache: that combination caused
// intermittent production 500s in a sibling project on this same stack. Nothing in this
// app calls revalidateTag today, so a tag cache would be cost without benefit.
//
// If tag-based revalidation is introduced later, add doShardedTagCache THEN - and add it
// together with the matching durable_objects + migrations blocks in wrangler.jsonc, or
// the Worker will fail to boot on a missing binding.
export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});
