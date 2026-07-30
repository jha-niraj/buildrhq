import { BuildrHQLoader } from "@repo/ui/components/ui/buildrhq-loader";

// Auth screens are full-page and have no content shape worth skeleton-ing, so the
// branded loader is the right fallback while sign-in / register / onboarding stream in.
export default function AuthLoading() {
	return <BuildrHQLoader label="Just a moment" />;
}
