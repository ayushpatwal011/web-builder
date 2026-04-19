import { plan as plans } from "../config/plan.js";
import stripe from "../config/stripe.js";

export const billing = async (req, res) => {
	try {
		const { planType } = req.body;
		const userId = req.user._id;
		const selectedPlan = plans[planType];
		if (!selectedPlan || selectedPlan.price === 0) {
			return res.status(400).json({
				message: "Invalid paid plan"
			});
		}
		
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],

			line_items: [
				{
					price_data: {
						currency: "inr",
						product_data: {
							name: `WebBuilder AI ${planType.toUpperCase()} Plan`,
						},
						unit_amount: selectedPlan.price * 100, 
					},
					quantity: 1,
				},
			],

			metadata: {
				userId: userId.toString(),
				credits: selectedPlan.credits.toString(),
				plan: planType,
			},

			success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
			cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
		});

		return res.status(200).json({
			sessionUrl: session.url,
		});

	} catch (e) {
		console.error("Billing Error:", e);

		return res.status(500).json({
			message: "Payment Error",
			error: e.message,
		});
	}
};