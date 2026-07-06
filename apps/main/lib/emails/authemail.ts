import { Resend } from "resend";
import {
	shell,
	heading,
	serif,
	paragraph,
	otpPanel,
	primaryButton,
	callout,
	urlFallback,
	featureList,
	type EmailContent,
} from "@repo/email";

const DEFAULT_FROM = "BuildrHQ <noreply@coderzai.xyz>";

function getResend(): Resend {
	if (!process.env.RESEND_API_KEY) {
		throw new Error("RESEND_API_KEY environment variable is not set");
	}
	return new Resend(process.env.RESEND_API_KEY);
}

function fromEmail(): string {
	return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
}

function appUrl(): string {
	return (
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.NEXT_PUBLIC_BASE_URL ||
		process.env.NEXTAUTH_URL ||
		"http://localhost:3004"
	);
}

// ─── Templates ────────────────────────────────────────────────────────────────

export const authEmailTemplates = {

	verifyOTP: (name: string, otp: string): EmailContent => ({
		subject: "Verify your email — BuildrHQ",
		html: shell({
			title: "Verify your email",
			eyebrow: "Email verification · BuildrHQ",
			body: `
				${heading(`Your verification ${serif("code")}.`)}
				${paragraph(`Hi ${name}, use the code below to verify your email address and finish setting up your account.`)}
				${otpPanel(otp, "One-time code", "Valid for 10 minutes")}
				${callout("Didn't create a BuildrHQ account? You can safely ignore this email.")}
			`,
		}),
	}),

	welcome: (name: string): EmailContent => ({
		subject: "Welcome to BuildrHQ",
		html: shell({
			title: "Welcome to BuildrHQ",
			eyebrow: "Account ready · BuildrHQ",
			body: `
				${heading(`Welcome aboard, ${serif(name)}.`)}
				${paragraph("Your email is verified and your account is ready. BuildrHQ is your engineering intelligence suite — here's what you can dive into next.")}
				${featureList("What's waiting for you", [
					"Build and showcase your developer portfolio",
					"Practice DSA, system design & take assessments",
					"Ace AI-powered mock technical interviews",
					"Ship real projects and track open-source impact",
				])}
				${primaryButton("Go to your dashboard", `${appUrl()}/home`)}
			`,
		}),
	}),

	resetPasswordOTP: (name: string, otp: string): EmailContent => ({
		subject: "Reset your password — BuildrHQ",
		html: shell({
			title: "Password reset request",
			eyebrow: "Security · One-time code",
			body: `
				${heading(`Reset your ${serif("password")}.`)}
				${paragraph(`Hi ${name}, we received a request to reset your password. Enter the code below on the reset page. It expires in <strong>10 minutes</strong>.`)}
				${otpPanel(otp, "Password reset code", "Valid for 10 minutes")}
				${callout("If you didn't request a password reset, you can ignore this email — your password won't change.")}
			`,
		}),
	}),

	passwordResetConfirmation: (name: string): EmailContent => ({
		subject: "Your password has been reset — BuildrHQ",
		html: shell({
			title: "Password updated",
			eyebrow: "Security · Confirmation",
			body: `
				${heading(`Your password was ${serif("updated")}.`)}
				${paragraph(`Hi ${name}, your password has been successfully changed. You can now sign in with your new password.`)}
				${primaryButton("Sign in", `${appUrl()}/signin`)}
				${callout("If you didn't make this change, please contact our support team immediately.")}
			`,
		}),
	}),

	verifyEmail: (name: string, verifyLink: string): EmailContent => ({
		subject: "Verify your email — BuildrHQ",
		html: shell({
			title: "Verify your email",
			eyebrow: "Email verification · BuildrHQ",
			body: `
				${heading(`One click to ${serif("activate")}.`)}
				${paragraph(`Hi ${name}, click the button below to verify your email address and activate your account. This link expires in <strong>72 hours</strong>.`)}
				${primaryButton("Verify email address", verifyLink)}
				${urlFallback(verifyLink)}
			`,
		}),
	}),

	resetPasswordLink: (name: string, resetLink: string): EmailContent => ({
		subject: "Reset your password — BuildrHQ",
		html: shell({
			title: "Password reset request",
			eyebrow: "Security · Password reset",
			body: `
				${heading(`Reset your ${serif("password")}.`)}
				${paragraph(`Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.`)}
				${primaryButton("Reset password", resetLink)}
				${callout("This link expires in 1 hour and can be used once.")}
				${urlFallback(resetLink)}
			`,
		}),
	}),

};

// ─── Sender ───────────────────────────────────────────────────────────────────

export type AuthEmailType =
	| "VERIFY_OTP"
	| "WELCOME"
	| "RESET_PASSWORD_OTP"
	| "CONFORMATION_MAIL"
	| "VERIFY"
	| "RESET_PASSWORD";

export interface SendAuthEmailParams {
	name?: string;
	email: string;
	emailType: AuthEmailType;
	token?: string | null;
	otp?: string;
}

export async function sendAuthEmail({
	name,
	email,
	emailType,
	token,
	otp,
}: SendAuthEmailParams) {
	const displayName = name || "there";
	let template: EmailContent;

	switch (emailType) {
		case "VERIFY_OTP": {
			if (!otp) throw new Error("otp is required for VERIFY_OTP");
			template = authEmailTemplates.verifyOTP(displayName, otp);
			break;
		}
		case "WELCOME": {
			template = authEmailTemplates.welcome(displayName);
			break;
		}
		case "RESET_PASSWORD_OTP": {
			if (!otp) throw new Error("otp is required for RESET_PASSWORD_OTP");
			template = authEmailTemplates.resetPasswordOTP(displayName, otp);
			break;
		}
		case "CONFORMATION_MAIL": {
			template = authEmailTemplates.passwordResetConfirmation(displayName);
			break;
		}
		case "VERIFY": {
			if (!token) throw new Error("token is required for VERIFY");
			const verifyLink = `${appUrl()}/verify?token=${token}`;
			template = authEmailTemplates.verifyEmail(displayName, verifyLink);
			break;
		}
		case "RESET_PASSWORD": {
			if (!token) throw new Error("token is required for RESET_PASSWORD");
			const resetLink = `${appUrl()}/resetpassword?token=${token}`;
			template = authEmailTemplates.resetPasswordLink(displayName, resetLink);
			break;
		}
		default:
			throw new Error(`Unknown emailType: ${emailType}`);
	}

	const result = await getResend().emails.send({
		from: fromEmail(),
		to: email,
		subject: template.subject,
		html: template.html,
	});

	if (result.error) {
		console.error("Failed to send email:", result.error);
		throw new Error(result.error.message);
	}

	console.log("Email sent successfully:", result.data?.id);
	return result;
}
