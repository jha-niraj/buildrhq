// Plain data module (no "use client") so the server page can build FAQ JSON-LD
// from the exact same list the client renders.
export interface PricingFaq {
	q: string
	a: string
}

export const pricingFaqs: PricingFaq[] = [
	{
		q: "How does ShiprHQ pricing work?",
		a: "ShiprHQ is credit-based, not subscription-based. You buy a pack of credits once and spend them only when you run our AI agents, generate projects, or take assessments. There's no monthly fee and no charge for idle time.",
	},
	{
		q: "Do credits expire?",
		a: "No. Your credits never expire - your balance is yours to use whenever you want, at whatever pace suits you.",
	},
	{
		q: "What can I spend credits on?",
		a: "Credits power everything AI-driven on the platform: project scaffolding and execution plans, AI mock technical interviews, resume and cover-letter generation, the Pathfinder career agent, and skill assessments.",
	},
	{
		q: "Is there a free way to get started?",
		a: "Yes. New accounts start with free credits so you can try the core tools, and you can earn more free credits by sharing ShiprHQ on LinkedIn or X.",
	},
	{
		q: "Which currencies and payment methods are supported?",
		a: "You can pay in INR or USD. Payments are processed securely with AES-256 encryption, and compute is provisioned instantly once your payment completes.",
	},
	{
		q: "Can I get a refund on unused credits?",
		a: "Because credits never expire and are provisioned instantly, purchases are generally non-refundable - but if something went wrong, reach out to support and we'll make it right.",
	},
	{
		q: "Do you offer plans for teams, universities, or high volume?",
		a: "Yes. For classrooms, cohorts, or high-volume compute, we offer custom volume pricing - contact our team and we'll tailor a plan for you.",
	},
	{
		q: "Will my credits work across the whole platform?",
		a: "Yes. A single credit balance works across every AI tool in your ShiprHQ account - build, practice, and interview prep all draw from the same balance.",
	},
]
