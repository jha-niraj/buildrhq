"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@repo/ui/components/themeprovider"
import { ShaderHeroBg, SHADER_PALETTES } from "@repo/ui/components/hero-shader-bg"

/**
 * The animated landing-hero shader, used as the onboarding form's background.
 * Theme-aware: the pearl (landing-hero) wash in light mode, a premium graphite in dark.
 * TypeformFlow lays a readable scrim over it, so it stays subtle behind the inputs.
 */
export function OnboardingShaderBg() {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	// The one place a JS theme read is unavoidable: a WebGL palette is an array of colours,
	// so it can't come from a `dark:` class the way every other surface does. Render NOTHING
	// until the theme resolves rather than paint a frame of the light `pearl` wash and swap —
	// that swap is a visible flash behind the form in dark mode. This is decorative
	// background under a scrim, so one missing frame costs nothing.
	if (!mounted) return null

	const isDark = resolvedTheme === "dark"
	return (
		<ShaderHeroBg
			colors={isDark ? SHADER_PALETTES.graphite : SHADER_PALETTES.pearl}
			light={!isDark}
			speed={0.5}
		/>
	)
}
