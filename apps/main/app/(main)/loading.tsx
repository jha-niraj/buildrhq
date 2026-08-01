import { ShiprHQLoader } from "@repo/ui/components/ui/shiprhq-loader";

// Group-level fallback for any /(main) route that doesn't ship its own loading.tsx.
// Routes that DO have one (e.g. /home's skeletons) keep it — a nested loading.tsx
// always wins over this, and a skeleton that previews the real layout beats a
// centred spinner inside an already-framed page.
export default function MainLoading() {
	return (
		<div className="h-full w-full">
			<ShiprHQLoader fullScreen={false} className="h-full min-h-[70vh] bg-transparent dark:bg-transparent" />
		</div>
	);
}
