import { plan as plans } from "../config/plan.js";
import stripe from "../config/stripe.js";
import User from "../models/user.model.js";

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

			success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
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

export const verifySession = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			const userId = session.metadata?.userId;
			const credits = Number(session.metadata?.credits);
			const plan = session.metadata?.plan;

			const user = await User.findById(userId);
			
			// Prevent double adding credits if webhook already updated it
			if (user && user.plan !== plan) {
				await User.findByIdAndUpdate(
					userId,
					{ $inc: { credits }, plan },
					{ new: true }
				);
			}
			return res.status(200).json({ success: true, message: "Payment verified successfully" });
		}
		
		return res.status(400).json({ success: false, message: "Payment not completed" });
	} catch (e) {
		console.error("Verification Error:", e);
		return res.status(500).json({ success: false, message: "Verification failed" });
	}
};