"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import { checkMustChangePassword } from "@/actions/profile/profile.action"

export function PasswordChangeBanner() {
    const [showBanner, setShowBanner] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        async function check() {
            const result = await checkMustChangePassword()
            if (result.success && result.mustChangePassword) {
                setShowBanner(true)
            }
        }
        check()
    }, [])

    if (!showBanner || dismissed) {
        return null
    }

    return (
        <div className="bg-neutral-50 dark:bg-neutral-800/20 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-neutral-800 dark:text-neutral-100 flex-shrink-0" />
                    <p className="text-sm text-neutral-800 dark:text-neutral-700">
                        <span className="font-semibold">Security Notice:</span> You&apos;re using a temporary password. Please change it to secure your account.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/profile#security">
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800/40"
                        >
                            Change Password
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1 text-neutral-800 hover:text-neutral-800 dark:text-neutral-100 dark:hover:text-neutral-700"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
