import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Cloudflare Workers deploy config for the ShiprHQ admin console.
//
// Same minimal shape as apps/main and apps/web: R2 incremental cache only. No
// Durable Object tag cache and no cache interception - that combination caused
// intermittent production 500s on this stack, and nothing here calls revalidateTag.
export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});
