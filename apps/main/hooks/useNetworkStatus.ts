import { useEffect, useState } from 'react';

/**
 * Whether the browser currently has a network connection.
 *
 * Starts as `true` and is only corrected from `navigator.onLine` after mount, on
 * purpose. The obvious version — seeding state with `navigator.onLine` — looks
 * server-safe because of a `typeof navigator !== 'undefined'` guard, but Node
 * 18+ defines a global `navigator` whose `onLine` property does not exist. The
 * guard passes, the read yields `undefined`, and the hook reports OFFLINE on
 * every server render.
 *
 * The consequence was not subtle: the app shell renders a full-screen
 * "Connection Lost" card when this is false, so the server-rendered HTML for
 * every authenticated page WAS that card. Users saw it until hydration replaced
 * it with the real page — the first paint, on exactly the slow connections
 * where first paint matters most.
 *
 * Assuming online until proven otherwise is the better default anyway: a false
 * "you're offline" is far more disruptive than half a second of optimism, and
 * the `offline` event corrects it immediately.
 */
export const useNetworkStatus = () => {
	const [isOnline, setIsOnline] = useState<boolean>(true);

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		// Read the real value once mounted — the first point at which a genuine
		// browser `navigator` is guaranteed.
		setIsOnline(navigator.onLine);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return isOnline;
};
