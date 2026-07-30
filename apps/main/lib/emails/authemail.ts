// The auth email templates + Resend sender now live in the shared package, so
// `@repo/auth` (which owns OTP + magic-link delivery) and the app send the exact
// same mail. Kept as a re-export so existing `@/lib/emails/authemail` and
// `@/utils/mail` imports don't have to change.
export {
	authEmailTemplates,
	sendAuthEmail,
	type AuthEmailType,
	type SendAuthEmailParams,
} from "@repo/email/auth";
